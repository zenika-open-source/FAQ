import { objectType, extendType, stringArg } from 'nexus'

import { slugify, confTagLabels } from '../helpers'
import manager from '../integrations'

export const Question = objectType({
  name: 'Question',
  definition(t) {
    t.model.id()

    t.model.title()
    t.model.slug()
    t.model.views()

    t.model.node()
    t.model.user()

    t.model.createdAt()
    t.model.updatedAt()
  }
})

export const CreateQuestion = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createQuestion', {
      type: 'Node',
      args: {
        title: stringArg({ required: true }),
        tags: stringArg({ required: true, list: true })
      },
      resolve: async (parent, { title, tags }, ctx) => {
        const tagLabels = confTagLabels(ctx)

        const node = await ctx.prisma.node.create({
          data: {
            question: {
              create: {
                title,
                slug: slugify(title),
                views: 0,
                user: {
                  connect: {
                    id: ctx.request.user.id
                  }
                }
              }
            },
            tags: {
              create: tags
                .filter(tagLabelId => !!tagLabels.find((label: any) => label.id === tagLabelId))
                .map(tagLabelId => ({
                  label: {
                    connect: {
                      id: tagLabelId
                    }
                  },
                  user: {
                    connect: {
                      id: ctx.request.user.id
                    }
                  }
                }))
            },
            flags: {
              create: {
                user: {
                  connect: {
                    id: ctx.request.user.id
                  }
                },
                type: 'unanswered'
              }
            }
          }
        })

        // TODO: send to channel

        await manager.trigger('question-created', ctx, {
          nodeId: node.id,
          meta: {
            title,
            tags: tags.map(id => tagLabels.find((label: any) => label.id === id).name)
          }
        })

        return node
      }
    })
  }
})

export const UpdateQuestion = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateQuestion', {
      type: 'Node',
      args: {
        id: stringArg({ required: true }),
        title: stringArg({ required: true }),
        previousTitle: stringArg({ required: true }),
        tags: stringArg({ required: true, list: true })
      },
      resolve: async (parent, { id, title, previousTitle, tags }, ctx) => {
        const previousNode = await ctx.prisma.node.findOne({
          where: { id },
          include: { question: true, tags: { include: { label: true } } }
        })

        if (previousNode?.question.title != previousTitle) {
          throw new Error('question-previously-edited')
        }

        const oldLabels = previousNode.tags.map(tag => tag.label.id)
        const newLabels = tags

        const tagsToCreate = newLabels.filter(newLabel => !oldLabels.includes(newLabel))
        const tagsToDelete = oldLabels.filter(oldLabel => !newLabels.includes(oldLabel))

        const tagLabels = confTagLabels(ctx)

        const promisesToCreate = tagsToCreate
          .filter(tagLabelId => !!tagLabels.find((label: any) => label.id === tagLabelId))
          .map(labelId =>
            ctx.prisma.tag.create({
              data: {
                label: { connect: { id: labelId } },
                node: { connect: { id: previousNode.id } },
                user: { connect: { id: ctx.request.user.id } }
              }
            })
          )

        const promisesToDelete = tagsToDelete.map(labelId =>
          ctx.prisma.tag.deleteMany({
            where: { node: { id: previousNode.id }, label: { id: labelId } }
          })
        )

        // @ts-ignore
        await Promise.all([...promisesToCreate, ...promisesToDelete])

        await ctx.prisma.question.update({
          where: { id: previousNode.question.id },
          data: { title, slug: slugify(title) }
        })

        const meta: any = {
          tagsChanges: {
            added: tagsToCreate.map(id => tagLabels.find((label: any) => label.id === id).name),
            removed: tagsToDelete.map(id => tagLabels.find((label: any) => label.id === id).name)
          }
        }

        if (title !== previousNode.question.title) {
          meta.title = title
        }

        await manager.trigger('question-updated', ctx, {
          nodeId: previousNode.id,
          meta
        })

        return ctx.prisma.node.findOne({ where: { id } })
      }
    })
  }
})

export const RandomQuestion = extendType({
  type: 'Query',
  definition(t) {
    t.field('randomQuestion', {
      type: 'Node',
      nullable: true,
      resolve: async (root, args, ctx) => {
        const nodeCount = await ctx.prisma.node.count()

        const randomIndex = Math.floor(Math.random() * nodeCount)

        const node = await ctx.prisma.node.findMany({
          first: 1,
          skip: randomIndex
        })

        return node[0]
      }
    })
  }
})

export const IncrementQuestionViewsCounter = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('incrementQuestionViewsCounter', {
      type: 'Question',
      nullable: true,
      args: {
        questionId: stringArg({ required: true })
      },
      resolve: async (root, args, ctx) => {
        const question = await ctx.prisma.question.findOne({ where: { id: args.questionId } })

        if (!question) return null

        return ctx.prisma.question.update({
          where: {
            id: args.questionId
          },
          data: {
            views: question.views + 1
          }
        })
      }
    })
  }
})
