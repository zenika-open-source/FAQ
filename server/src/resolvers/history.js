module.exports = {
  Query: {
    history: async (_, args, ctx, info) => {
      const entriesCount = (await ctx.prisma.query.historyActionsConnection(
        args,
        '{ aggregate { count } }'
      )).aggregate.count

      const meta = {
        entriesCount,
        pageCurrent: args.skip / args.first + 1,
        pagesCount: Math.ceil(entriesCount / args.first)
      }

      return { meta, ...args }
    }
  },
  History: {
    historyActions: (parent, args, ctx, info) =>
      ctx.prisma.query.historyActions(parent, info)
  }
}
