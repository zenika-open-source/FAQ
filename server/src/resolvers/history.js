module.exports = {
  Query: {
    history: async (_, { first, skip, ...args }, ctx, info) => {
      const entriesCount = (await ctx.prisma.query.historyActionsConnection(
        args,
        '{ aggregate { count } }'
      )).aggregate.count

      const meta = {
        entriesCount,
        pageCurrent: skip / first + 1,
        pagesCount: Math.ceil(entriesCount / first)
      }

      return { meta, first, skip, ...args }
    }
  },
  History: {
    historyActions: (parent, args, ctx, info) => ctx.prisma.query.historyActions(parent, info)
  }
}
