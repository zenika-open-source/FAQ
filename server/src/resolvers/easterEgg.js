module.exports = {
  Query: {
    randomNode: async (_, { tag }, ctx, info) => {
      let where = {}

      if (tag) {
        where = { label: tag }
      }

      const tagsCount = (await ctx.prisma.query.tagsConnection(
        {
          where
        },
        `
        {
          aggregate {
            count
          }
        }
        `
      )).aggregate.count

      const randomIndex = Math.floor(Math.random() * tagsCount)

      const randomTag = (await ctx.prisma.query.tags(
        { skip: randomIndex, take: 1 },
        '{ node { id } }'
      ))[0]

      return ctx.prisma.query.zNode({ where: { id: randomTag.node.id } }, info)
    }
  }
}
