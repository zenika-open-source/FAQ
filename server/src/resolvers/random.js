module.exports = {
  Query: {
    randomNode: async (_, { tag }, ctx) => {
      let where = {}

      if (tag) {
        where = { label: tag }
      }

      // TODO: use a real aggregation
      const tagsCount = (await ctx.photon.tags.findMany({ where })).length

      const randomIndex = Math.floor(Math.random() * tagsCount)

      const randomTag = (await ctx.photon.tags.findsMany({
        where: { skip: randomIndex, take: 1, include: { node: true } }
      }))[0]

      return ctx.photon.nodes.findOne({
        where: { id: randomTag.node.id },
        include: {
          question: { include: { user: true } },
          answer: { include: { user: true, sources: true } },
          tags: { include: { user: true } },
          flags: { include: { user: true } }
        }
      })
    }
  }
}
