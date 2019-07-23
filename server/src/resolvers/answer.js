const { history, ctxUser } = require('../helpers')
const { algolia, mailgun } = require('../integrations')

module.exports = {
  Mutation: {
    createAnswerAndSources: async (_, { content, sources, nodeId }, ctx) => {
      sources = JSON.parse(sources)

      const node = await ctx.photon.nodes.findOne({
        where: { id: nodeId },
        include: { answer: true }
      })

      if (node.answer) {
        throw new Error('Someone already answered this question! Refresh this page.')
      }

      let answer = await ctx.photon.answers.create({
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
      })

      await ctx.photon.flags.deleteMany({
        where: { node: { id: nodeId }, type: 'unanswered' }
      })

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
      mailgun.sendNewAnswer(ctx, nodeId)

      return ctx.photon.answers.findOne({
        where: { id: answer.id },
        include: {
          node: {
            include: {
              question: { include: { user: true } },
              flags: { include: { user: true } },
              tags: { include: { user: true } }
            }
          },
          sources: true,
          user: true
        }
      })
    },
    updateAnswerAndSources: async (_, { id, content, previousContent, sources }, ctx, info) => {
      const answer = await ctx.photon.answers.findOne({
        where: { id },
        include: { node: true, sources: true }
      })

      if (previousContent !== answer.content) {
        throw new Error(
          "Another user edited the answer before you, copy your version and refresh the page. If you don't copy your version, it will be lost"
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
        ctx.photon.sources.create({
          data: {
            label,
            url,
            answer: { connect: { id: answer.id } }
          }
        })
      )

      const mutationsToUpdate = sourcesToUpdate.map(({ id, label, url }) =>
        ctx.photon.sources.update({
          where: { id },
          data: {
            label,
            url
          }
        })
      )

      const mutationsToRemove = sourcesToRemove.map(source =>
        ctx.photon.sources.delete({ where: { id: source.id } })
      )

      await Promise.all([...mutationsToAdd, ...mutationsToUpdate, ...mutationsToRemove])

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

      await ctx.photon.answers.update({
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

      return ctx.photon.answers.findOne({
        where: { id: answer.id },
        include: {
          node: {
            include: {
              question: { include: { user: true } },
              flags: { include: { user: true } },
              tags: { include: { user: true } }
            }
          },
          sources: true,
          user: true
        }
      })
    }
  }
}
