const { algolia } = require('./integrations')

module.exports = {
  Query: {
    search: async (_, args, ctx, info) => {
      const { text, tags = [], flags = [], ...params } = args

      const meta = {
        count: null,
        resultsPerPage: params.first
      }

      if (!text && tags.length === 0 && flags.length === 0) {
        meta.count = (await ctx.prisma.query.zNodesConnection(
          args,
          `{ aggregate { count } }`
        )).aggregate.count

        return { meta, ids: null, ...params }
      }

      const { ids, highlights, nbHits } = await algolia.search(args)

      meta.count = nbHits

      return { meta, ids, highlights }
    }
  },
  SearchResult: {
    nodes: async ({ ids, highlights, ...params }, args, ctx, info) => {
      if (!ids)
        return ctx.prisma.query.zNodes(
          { orderBy: 'createdAt_DESC', ...params },
          info
        )

      let nodes = await ctx.prisma.query.zNodes(
        {
          where: {
            id_in: ids
          }
        },
        info
      )

      nodes = nodes
        .map(node => ({ ...node, highlights: highlights[node.id] }))
        .sort((a, b) => {
          return ids.indexOf(a.id) - ids.indexOf(b.id)
        })

      return nodes
    }
  }
}
