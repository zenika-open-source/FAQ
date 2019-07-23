const { algolia } = require('../integrations')

module.exports = {
  Query: {
    search: async (_, args, ctx) => {
      const { text, tags = [], flags = [], skip, first, ...params } = args

      let results = {
        meta: {
          pageCurrent: skip / first + 1
        },
        skip,
        first,
        ...params
      }

      if (!text && tags.length === 0 && flags.length === 0) {
        // TODO: Use aggregation instead (See Notes.md)
        const count = (await ctx.photon.nodes.findMany({ select: { id: true } })).length

        results = {
          ...results,
          ids: null,
          count
        }
      } else {
        const { ids, highlights, nbHits } = await algolia.search(ctx, args)

        results = {
          ...results,
          ids,
          highlights,
          count: nbHits
        }
      }

      return {
        ...results,
        meta: {
          ...results.meta,
          entriesCount: results.count,
          pagesCount: Math.ceil(results.count / first)
        }
      }
    }
  },
  SearchResult: {
    nodes: async ({ ids, highlights, first, skip }, args, ctx, info) => {
      if (!ids) {
        return ctx.photon.nodes.findMany({
          orderBy: { createdAt: 'desc' },
          first,
          skip,
          include: { question: true, answer: true, flags: true, tags: true }
        })
      }

      let nodes = await ctx.photon.zNodes.findMany({
        where: {
          id: {
            in: ids
          }
        },
        include: { question: true, answer: true, flags: true, tags: true }
      })

      nodes = nodes
        .map(node => ({ ...node, highlights: highlights[node.id] }))
        .sort((a, b) => {
          return ids.indexOf(a.id) - ids.indexOf(b.id)
        })

      return nodes
    }
  }
}
