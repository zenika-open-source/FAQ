const { forwardTo } = require('prisma-binding')

module.exports = {
  Mutation: {
    updateQuestionAndTags: async (_, { where, data, tags }, ctx, info) => {
      // Here, update tags

      const updatedQuestion = await ctx.prisma.mutation.updateQuestion(
        {
          where,
          data: {
            ...data,
            slug: 'new-slug'
          }
        },
        info
      )

      return updatedQuestion
    }
  }
}
