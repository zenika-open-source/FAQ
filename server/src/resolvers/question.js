const { forwardTo } = require('prisma-binding')

const { ctxUser } = require('./helpers')

module.exports = {
  Mutation: {
    updateQuestionAndTags: async (_, { where, data, tags }, ctx, info) => {
      // Here, update tags

      const updatedQuestion = await ctx.prisma.mutation.updateQuestion(
        {
          where,
          data: {
            ...data,
            user: { connect: { id: ctxUser(ctx).id } },
            slug: 'new-slug'
          }
        },
        info
      )

      return updatedQuestion
    }
  }
}
