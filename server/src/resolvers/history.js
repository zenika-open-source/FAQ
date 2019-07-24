module.exports = {
  Query: {
    history: async (_, { first, skip, ...args }, ctx) => {
      // TODO: Use an aggregation (See Notes.md)
      const entriesCount = (await ctx.photon.historyActions.findMany(args)).length

      const meta = {
        entriesCount,
        pageCurrent: skip / first + 1,
        pagesCount: Math.ceil(entriesCount / first)
      }

      return { meta, first, skip, ...args }
    }
  },
  History: {
    historyActions: async ({ where, orderBy, skip, first }, args, ctx) => {
      const actions = await ctx.photon.historyActions.findMany({
        where,
        orderBy,
        skip,
        first,
        include: {
          node: { include: { question: true } },
          user: true
        }
      })

      // TODO: Remove manual deserialization (See Notes.md)
      actions.forEach(a => (a.meta = JSON.parse(a.meta)))

      return actions
    }
  }
}
