import { extendType, objectType, stringArg, intArg } from 'nexus'

export const HistoryAction = objectType({
  name: 'HistoryAction',
  definition(t) {
    t.model.id()

    t.model.action()
    t.model.model()
    t.model.meta()

    t.model.node()
    t.model.user()

    t.model.createdAt()
  }
})

export const HistoryResult = objectType({
  name: 'HistoryResult',
  definition(t) {
    t.field('historyActions', {
      type: 'HistoryAction',
      list: true
    })

    t.field('meta', {
      type: 'PaginationMeta'
    })
  }
})

export const History = extendType({
  type: 'Query',
  definition(t) {
    t.field('history', {
      type: 'HistoryResult',
      args: {
        nodeId: stringArg({ required: false }),
        userId: stringArg({ required: false }),
        first: intArg({ required: true }),
        skip: intArg({ required: true })
      },
      resolve: async (root, { nodeId, userId, first, skip }, ctx) => {
        let where

        if (nodeId) {
          where = {
            node: {
              id: nodeId
            }
          }
        } else if (userId) {
          where = {
            user: {
              id: userId
            }
          }
        }

        // Fix this when we can do a parameterized count
        let historyActions = await ctx.prisma.historyAction.findMany({
          where,
          orderBy: {
            createdAt: 'desc'
          }
        })

        const count = historyActions.length

        historyActions = historyActions.slice(skip, first + skip)
        // -- end fix --

        return {
          historyActions,
          meta: {
            entriesCount: count,
            pageCurrent: skip / first + 1,
            pagesCount: Math.ceil(count / first)
          }
        }
      }
    })
  }
})
