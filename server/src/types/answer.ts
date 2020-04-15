import { objectType, extendType, stringArg } from 'nexus'

import manager from '../integrations'
import { FaqError } from '../helpers'

export const Answer = objectType({
  name: 'Answer',
  definition(t) {
    t.model.id()

    t.model.content()

    t.field('sources', {
      type: 'Source',
      list: true,
      resolve: parent => JSON.parse(parent.sources)
    })

    t.model.node()
    t.model.user()

    t.model.createdAt()
    t.model.updatedAt()
  }
})

export const Source = objectType({
  name: 'Source',
  definition(t) {
    t.string('label')
    t.string('url')
  }
})

export const CreateAnswerAndSources = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createAnswerAndSources', {
      type: 'Answer',
      args: {
        content: stringArg({ required: true }),
        sources: stringArg({ required: true }),
        nodeId: stringArg({ required: true })
      },
      resolve: async (root, { content, sources, nodeId }, ctx) => {
        let answer

        try {
          answer = await ctx.prisma.answer.create({
            data: {
              content,
              node: {
                connect: {
                  id: nodeId
                }
              },
              user: {
                connect: {
                  id: ctx.request.user.id
                }
              },
              sources
            },
            include: {
              node: {
                include: {
                  question: {
                    include: {
                      user: true
                    }
                  }
                }
              },
              user: true
            }
          })
        } catch (e) {
          // If an answer already exists
          if (
            e.message &&
            e.message.includes &&
            e.message.includes('NodeAnswer') &&
            e.message.includes('RelationViolation')
          ) {
            throw new FaqError(
              'answer-already-submitted',
              'Someone already answered this question! Refresh this page.'
            )
          }
          throw e
        }

        await ctx.prisma.flag.deleteMany({
          where: {
            node: { id: nodeId },
            type: 'unanswered'
          }
        })

        // Let's notify the user who asked the question, but only if they did not answer the
        // question them-selves.
        if (answer.node.question.user.id !== answer.user.id) {
          //mailgun.sendNewAnswer(ctx, nodeId)
          // TODO: Send mail
        }

        await manager.trigger('answer-created', ctx, {
          nodeId,
          meta: { content, sources: JSON.parse(sources) }
        })

        return ctx.prisma.answer.findOne({ where: { id: answer.id } })
      }
    })
  }
})

export const UpdateAnswerAndSources = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateAnswerAndSources', {
      type: 'Answer',
      args: {
        id: stringArg({ required: true }),
        content: stringArg({ required: true }),
        previousContent: stringArg({ required: true }),
        sources: stringArg({ required: true }),
        previousSources: stringArg({ required: true })
      },
      resolve: async (root, { id, content, previousContent, sources, previousSources }, ctx) => {
        const answer = await ctx.prisma.answer.findOne({ where: { id }, include: { node: true } })

        if (!answer) {
          throw new FaqError('no-answer', `No answer found with id: ${id}`)
        }

        if (
          previousContent !== answer.content ||
          answer.sources !==
            JSON.stringify(
              JSON.parse(previousSources).map(({ label, url }: { label: string; url: string }) => ({
                label,
                url
              }))
            )
        ) {
          throw new FaqError(
            'answer-already-edited',
            "Another user edited the answer before you, copy your version and refresh the page. If you don't copy your version, It will be lost"
          )
        }

        await ctx.prisma.answer.update({
          where: { id },
          data: {
            content,
            sources
          }
        })

        const sourcesAdded = JSON.parse(sources).filter(
          (newSource: any) =>
            !JSON.parse(previousSources).find(
              (s: any) => s.label == newSource.label && s.url == newSource.url
            )
        )
        const sourcesRemoved = JSON.parse(previousSources)
          .filter(
            (oldSource: any) =>
              !JSON.parse(sources).find(
                (s: any) => s.label == oldSource.label && s.url == oldSource.url
              )
          )
          .map(({ label, url }: any) => ({ label, url }))

        const meta: any = {
          sourcesChanges: {
            added: sourcesAdded,
            removed: sourcesRemoved
          }
        }

        if (content !== answer.content) {
          meta.content = content
        }

        await manager.trigger('answer-updated', ctx, { nodeId: answer.node.id, meta })

        return ctx.prisma.answer.findOne({ where: { id } })
      }
    })
  }
})
