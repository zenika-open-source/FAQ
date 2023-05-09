const { ctxUser } = require('../helpers')
const {
  createFlagAndUpdateHistoryAndAlgolia,
  deleteFlagAndUpdateHistoryAndAlgolia
} = require('../helpers/updateHistoryAndAlgolia')

module.exports = {
  Mutation: {
    addFlag: async (_, { type, nodeId }, ctx, info) => {
      const flag = await ctx.prisma.exists.Flag({ node: { id: nodeId }, type })

      if (!flag) {
        await ctx.prisma.mutation.createFlag({
          data: {
            type,
            node: { connect: { id: nodeId } },
            user: { connect: { id: ctxUser(ctx).id } }
          }
        })

        await createFlagAndUpdateHistoryAndAlgolia(type, ctx, nodeId)
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
        await ctx.prisma.mutation.deleteFlag({
          where: { id: flags[0].id }
        })

        await deleteFlagAndUpdateHistoryAndAlgolia(type, ctx, nodeId)
      }

      return ctx.prisma.query.zNode({ where: { id: nodeId } }, info)
    }
  }
}
