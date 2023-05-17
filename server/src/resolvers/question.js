const { history, ctxUser, slugify, questionDeleteCertifWhenNotSpecialist } = require('../helpers')
const { algolia, slack } = require('../integrations')

// TMP_TAGS
const confSubjects = ctx =>
  ctx.prisma._meta.configuration.tagCategories.reduce((acc, cat) => acc.concat(cat.labels), [])

module.exports = {
  Query: {
    zNode: (_, args, ctx, info) => ctx.prisma.query.zNode(args, info)
  },
  Mutation: {
    createQuestionAndTags: async (_, { title, tags }, ctx, info) => {
      const subjects = confSubjects(ctx)

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
                .filter(subjectId => !!subjects.find(label => label.id === subjectId))
                .map(subjectId => ({
                  label: { connect: { id: subjectId } },
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
        meta: {
          title,
          tags: tags.map(id => subjects.find(label => label.id === id).name)
        },
        nodeId: node.id
      })

      algolia.addNode(ctx, node.id)
      slack.sendToChannel(ctx, node.id)

      return ctx.prisma.query.question({ where: { id: node.question.id } }, info)
    },
    updateQuestionAndTags: async (_, { id, title, previousTitle, tags }, ctx, info) => {
      const subjects = confSubjects(ctx)

      const node = (
        await ctx.prisma.query.question(
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
              label {
                id
                name
              }
            }
            flags {
              id
              type
              user {
                id
                specialties {
                  id
                  name
                }
              }
            }
          }
        }
        `
        )
      ).node
      if (previousTitle !== node.question.title) {
        throw new Error(
          "Another user edited the question before you, copy your version and refresh the page. If you don't copy your version, It will be lost"
        )
      }

      const oldLabels = node.tags.map(tag => tag.label.id)
      const newLabels = tags

      const tagsToAdd = newLabels.filter(newLabel => !oldLabels.includes(newLabel))
      const tagsToRemove = oldLabels.filter(oldLabel => !newLabels.includes(oldLabel))

      const mutationsToAdd = tagsToAdd
        .filter(labelId => subjects.find(label => label.id === labelId))
        .map(labelId =>
          ctx.prisma.mutation.createTag({
            data: {
              label: { connect: { id: labelId } },
              node: { connect: { id: node.id } },
              user: { connect: { id: ctxUser(ctx).id } }
            }
          })
        )

      const mutationsToRemove = tagsToRemove.map(labelId =>
        ctx.prisma.mutation.deleteManyTags({
          where: {
            node: { id: node.id },
            label: { id: labelId }
          }
        })
      )

      await Promise.all([...mutationsToAdd, ...mutationsToRemove])

      await questionDeleteCertifWhenNotSpecialist(node, tags, ctx)

      const meta = {
        tagsChanges: {
          added: tagsToAdd.map(id => subjects.find(label => label.id === id).name),
          removed: tagsToRemove.map(id => subjects.find(label => label.id === id).name)
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
    },
    incrementQuestionViewsCounter: async (_, { id }, ctx, info) => {
      const { node } = await ctx.prisma.query.question(
        { where: { id } },
        `
        {
          node {
            id
            question {
              views
            }
          }
        }
        `
      )

      return ctx.prisma.mutation.updateQuestion(
        {
          where: { id },
          data: {
            views: node.question.views + 1
          }
        },
        info
      )
    }
  }
}
