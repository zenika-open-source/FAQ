const {
  history,
  ctxUser,
  refreshCertifiedFlag,
  addCertifiedFlagWhenSpecialist
} = require('../helpers')
const { algolia, mailgun } = require('../integrations')

module.exports = {
  Mutation: {
    createAnswerAndSources: async (_, { content, sources, nodeId }, ctx, info) => {
      sources = JSON.parse(sources)

      let answer

      try {
        answer = await ctx.prisma.mutation.createAnswer(
          {
            data: {
              content,
              node: {
                connect: {
                  id: nodeId
                }
              },
              user: {
                connect: {
                  id: ctxUser(ctx).id
                }
              },
              sources: {
                create: sources
              }
            }
          },
          `
        {
          id
          user {
            id
            specialties {
              id
              name
            }
          }
          node {
            flags(where:{type:"unanswered"}) {
              id
            }
            tags {
              label {
                id
              }
            }
            question {
              user {
                id
              }
            }
          }
        }
        `
        )
      } catch (e) {
        // The error doesn't includes the error code, so we use the message
        if (
          e.message &&
          e.message.includes &&
          e.message.includes('NodeAnswer') &&
          e.message.includes('violate')
        ) {
          throw new Error('Someone already answered this question! Refresh this page.')
        }
        throw e
      }

      await ctx.prisma.mutation.deleteManyFlags({
        where: { node: { id: nodeId }, type: 'unanswered' }
      })

      await addCertifiedFlagWhenSpecialist(history, answer.user, answer.node, nodeId, ctx)

      await history.push(ctx, {
        action: 'CREATED',
        model: 'Answer',
        meta: {
          content,
          sources
        },
        nodeId
      })

      algolia.updateNode(ctx, nodeId)

      // Let's notify the user who asked the question, but only if they did not answer the
      // question them-selves.
      if (answer.node.question.user.id !== answer.user.id) {
        mailgun.sendNewAnswer(ctx, nodeId)
      }

      return ctx.prisma.query.answer(
        {
          where: { id: answer.id }
        },
        info
      )
    },
    updateAnswerAndSources: async (_, { id, content, previousContent, sources }, ctx, info) => {
      const answer = await ctx.prisma.query.answer(
        { where: { id } },
        `
        {
          id
          content
          sources {
            id
            label
            url
          }
          node {
            id
            tags {
              label {
                id
              }
            }
            flags {
              id
              type
            }
          }
          user {
            id
            name
            specialties {
              id
              name
            }
          }
        }
        `
      )

      const user = await ctx.prisma.query.user(
        { where: { id: ctxUser(ctx).id } },
        `
            {
              id
              specialties {
                id
              }
            }
          `
      )

      if (previousContent !== answer.content) {
        throw new Error(
          "Another user edited the answer before you, copy your version and refresh the page. If you don't copy your version, It will be lost"
        )
      }

      const oldSources = answer.sources
      const newSources = JSON.parse(sources)

      const sourcesToAdd = newSources.filter(
        newSource => !oldSources.map(s => s.id).includes(newSource.id)
      )
      const sourcesToUpdate = newSources.filter(newSource => {
        if (oldSources.map(s => s.id).includes(newSource.id)) {
          const oldSource = oldSources.filter(s => s.id === newSource.id)[0]

          return oldSource.label !== newSource.label || oldSource.url !== newSource.url
        }
        return false
      })
      const sourcesToRemove = oldSources.filter(
        oldSource => !newSources.map(s => s.id).includes(oldSource.id)
      )

      const mutationsToAdd = sourcesToAdd.map(({ label, url }) =>
        ctx.prisma.mutation.createSource({
          data: {
            label,
            url,
            answer: { connect: { id: answer.id } }
          }
        })
      )

      const mutationsToUpdate = sourcesToUpdate.map(({ id, label, url }) =>
        ctx.prisma.mutation.updateSource({
          where: { id },
          data: {
            label,
            url
          }
        })
      )

      const mutationsToRemove = sourcesToRemove.map(source =>
        ctx.prisma.mutation.deleteSource({ where: { id: source.id } })
      )

      await Promise.all([...mutationsToAdd, ...mutationsToUpdate, ...mutationsToRemove])

      await refreshCertifiedFlag(history, answer, user, ctx)

      const clean = sources => sources.map(s => ({ label: s.label, url: s.url }))

      const meta = {
        sourcesChanges: {
          added: clean(sourcesToAdd),
          updated: clean(sourcesToUpdate),
          removed: clean(sourcesToRemove)
        }
      }

      if (content !== answer.content) {
        meta.content = content
      }

      await ctx.prisma.mutation.updateAnswer({
        where: { id },
        data: {
          content
        }
      })

      await history.push(ctx, {
        action: 'UPDATED',
        model: 'Answer',
        meta,
        nodeId: answer.node.id
      })

      algolia.updateNode(ctx, answer.node.id)

      return ctx.prisma.query.answer(
        {
          where: { id }
        },
        info
      )
    }
  }
}
