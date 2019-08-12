// TMP_TAGS

module.exports = {
  Query: {
    randomNode: async (_, { tag }, ctx, info) => {
      let id

      if (tag) {
        const { count } = (await ctx.prisma.query.tagsConnection(
          {
            where: { tagLabel: { name: tag } }
          },
          `
          {
            aggregate {
              count
            }
          }
          `
        )).aggregate

        const randomIndex = Math.floor(Math.random() * count)

        const randomTag = (await ctx.prisma.query.tags(
          { skip: randomIndex, take: 1, where: { tagLabel: { name: tag } } },
          '{ node { id } }'
        ))[0]

        id = randomTag.node.id
      } else {
        const { count } = (await ctx.prisma.query.questionsConnection(
          {},
          `
        {
          aggregate {
            count
          }
        }
        `
        )).aggregate

        const randomIndex = Math.floor(Math.random() * count)

        const randomQuestion = (await ctx.prisma.query.questions(
          { skip: randomIndex, take: 1 },
          '{ node { id } }'
        ))[0]

        id = randomQuestion.node.id
      }

      return ctx.prisma.query.zNode({ where: { id } }, info)
    }
  }
}
