const { history, ctxUser, slugify } = require('./helpers')
const { algolia, slack } = require('./integrations')

const confTagList = ctx =>
  Object.values(ctx.prisma._meta.configuration.tags).reduce((acc, x) => acc.concat(x), [])

module.exports = {
  Query: {
    zNode: (_, args, ctx, info) => ctx.prisma.query.zNode(args, info)
  },
  Mutation: {
    createQuestionAndTags: async (_, { title, tags }, ctx, info) => {
      const tagList = confTagList(ctx)

      const node = await ctx.prisma.mutation.createZNode(
        {
          data: {
            question: {
              create: {
                title,
                slug: slugify(title),
                user: { connect: { id: ctxUser(ctx).id } }
              }
            },
            tags: {
              create: tags
                .filter(label => tagList.includes(label))
                .map(label => ({
                  label,
                  user: { connect: { id: ctxUser(ctx).id } }
                }))
            },
            flags: {
              create: {
                type: 'unanswered',
                user: { connect: { id: ctxUser(ctx).id } }
              }
            }
          }
        },
        `
        {
          id
          question {
            id
          }
        }
        `
      )

      await history.push(ctx, {
        action: 'CREATED',
        model: 'Question',
        meta: { title, tags },
        nodeId: node.id
      })

      algolia.addNode(ctx, node.id)
      slack.sendToChannel(ctx, node.id)

      return ctx.prisma.query.question({ where: { id: node.question.id } }, info)
    },
    updateQuestionAndTags: async (_, { id, title, previousTitle, tags }, ctx, info) => {
      const tagList = confTagList(ctx)

      const node = (await ctx.prisma.query.question(
        { where: { id } },
        `
        {
          node {
            id
            question {
              title
            }
            tags {
              id
              label
            }
          }
        }
        `
      )).node
      if (previousTitle !== node.question.title) {
        throw new Error('Another user edited the question before you, copy your version and refresh the page. If you don\'t copy your version, It will be lost')
      }

      const oldTags = node.tags
      const newTags = tags

      const tagsToAdd = newTags.filter(newTag => !oldTags.map(t => t.label).includes(newTag))
      const tagsToRemove = oldTags.filter(oldTag => !newTags.includes(oldTag.label))

      const mutationsToAdd = tagsToAdd
        .filter(label => tagList.includes(label))
        .map(label =>
          ctx.prisma.mutation.createTag({
            data: {
              label,
              node: { connect: { id: node.id } },
              user: { connect: { id: ctxUser(ctx).id } }
            }
          })
        )

      const mutationsToRemove = tagsToRemove.map(tag =>
        ctx.prisma.mutation.deleteTag({ where: { id: tag.id } })
      )

      await Promise.all([...mutationsToAdd, ...mutationsToRemove])

      const meta = {
        tagsChanges: {
          added: tagsToAdd,
          removed: tagsToRemove.map(t => t.label)
        }
      }

      if (title !== node.question.title) {
        meta.title = title
      }

      await ctx.prisma.mutation.updateQuestion({
        where: { id },
        data: {
          title,
          slug: slugify(title)
        }
      })

      await history.push(ctx, {
        action: 'UPDATED',
        model: 'Question',
        meta,
        nodeId: node.id
      })

      algolia.updateNode(ctx, node.id)

      return ctx.prisma.query.question(
        {
          where: { id }
        },
        info
      )
    }
  }
}
