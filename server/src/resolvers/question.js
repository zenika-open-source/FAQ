const { history, ctxUser, slugify } = require('../helpers')
const { algolia, slack } = require('../integrations')

const confTagList = ctx =>
  Object.values(ctx.photon._meta.configuration.tags).reduce((acc, x) => acc.concat(x), [])

module.exports = {
  Query: {
    node: async (_, args, ctx) =>
      ctx.photon.nodes.findOne({
        ...args,
        include: {
          question: { include: { user: true } },
          answer: { include: { user: true, sources: true } },
          tags: { include: { user: true } },
          flags: { include: { user: true } }
        }
      })
  },
  Mutation: {
    createQuestionAndTags: async (_, { title, tags }, ctx) => {
      const tagList = confTagList(ctx)

      // TODO: Make a nested operation (See Notes.md)
      const node = await ctx.photon.nodes.create({
        data: {
          dummy: true
        }
      })
      const question = await ctx.photon.questions.create({
        data: {
          title,
          slug: slugify(title),
          user: { connect: { id: ctxUser(ctx).id } },
          node: { connect: { id: node.id } }
        }
      })
      await Promise.all(
        tags
          .filter(label => tagList.includes(label))
          .map(label =>
            ctx.photon.tags.create({
              data: {
                label,
                user: { connect: { id: ctxUser(ctx).id } },
                node: { connect: { id: node.id } }
              }
            })
          )
      )
      await ctx.photon.flags.create({
        data: {
          type: 'unanswered',
          user: { connect: { id: ctxUser(ctx).id } },
          node: { connect: { id: node.id } }
        }
      })

      await history.push(ctx, {
        action: 'CREATED',
        model: 'Question',
        meta: { title, tags },
        nodeId: node.id
      })

      algolia.addNode(ctx, node.id)
      slack.sendToChannel(ctx, node.id)

      return ctx.photon.questions.findOne({
        where: { id: question.id },
        include: {
          node: {
            include: { flags: { include: { user: true } }, tags: { include: { user: true } } }
          },
          user: true
        }
      })
    },
    incrementQuestionViewsCounter: async (_, { id }, ctx) => {
      const { node } = await ctx.photon.questions.findOne(
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

      return ctx.photon.questions.update({
        where: { id },
        data: {
          views: node.question.views + 1
        },
        include: {
          node: {
            include: {
              answer: { include: { user: true } },
              flags: { include: { user: true } },
              tags: { include: { user: true } }
            }
          },
          user: true
        }
      })
    },
    updateQuestionAndTags: async (_, { id, title, previousTitle, tags }, ctx) => {
      const tagList = confTagList(ctx)

      const node = (await ctx.photon.questions.findOne({
        where: { id },
        include: { node: { include: { question: true, tags: true } } }
      })).node

      if (previousTitle !== node.question.title) {
        throw new Error(
          "Another user edited the question before you, copy your version and refresh the page. If you don't copy your version, it will be lost"
        )
      }

      const oldTags = node.tags
      const newTags = tags

      const tagsToAdd = newTags.filter(newTag => !oldTags.map(t => t.label).includes(newTag))
      const tagsToRemove = oldTags.filter(oldTag => !newTags.includes(oldTag.label))

      const mutationsToAdd = tagsToAdd
        .filter(label => tagList.includes(label))
        .map(label =>
          ctx.photon.tags.create({
            data: {
              label,
              node: { connect: { id: node.id } },
              user: { connect: { id: ctxUser(ctx).id } }
            }
          })
        )

      const mutationsToRemove = tagsToRemove.map(tag =>
        ctx.photon.tags.delete({ where: { id: tag.id } })
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

      await ctx.photon.questions.update({
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

      return ctx.photon.questions.findOne({
        where: { id },
        include: {
          node: {
            include: {
              answer: { include: { user: true } },
              flags: { include: { user: true } },
              tags: { include: { user: true } }
            }
          },
          user: true
        }
      })
    }
  }
}
