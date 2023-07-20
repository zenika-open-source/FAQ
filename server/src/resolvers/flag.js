const {
  ctxUser,
  createFlagAndUpdateHistoryAndAlgolia,
  deleteFlagAndUpdateHistoryAndAlgolia,
  history
} = require('../helpers')

module.exports = {
  Mutation: {
    addFlag: async (_, { type, nodeId }, ctx, info) => {
      const flag = await ctx.prisma.exists.Flag({ node: { id: nodeId }, type })

      if (!flag) {
        await createFlagAndUpdateHistoryAndAlgolia(history, type, ctx, nodeId, ctxUser(ctx).id)
      }

      if (type === 'certified') {
        let certified = ''
        const node = await ctx.prisma.query.zNode(
          {
            where: { id: nodeId }
          },
          `{
            id
            answer {
              id
            }
          }`
        )
        await ctx.prisma.mutation.updateAnswer({
          where: { id: node.answer.id },
          data: { certified }
        })
      }

      return ctx.prisma.query.zNode({ where: { id: nodeId } }, info)
    },
    removeFlag: async (_, { type, nodeId }, ctx, info) => {
      const flags = await ctx.prisma.query.flags(
        {
          where: { node: { id: nodeId }, type }
        },
        '{ id }'
      )

      if (flags) {
        await deleteFlagAndUpdateHistoryAndAlgolia(history, type, ctx, nodeId, flags[0].id)
      }

      return ctx.prisma.query.zNode({ where: { id: nodeId } }, info)
    }
  }
}
