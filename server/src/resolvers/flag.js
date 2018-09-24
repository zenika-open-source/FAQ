const { history, ctxUser } = require('./helpers')
const { algolia } = require('./integrations')

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

        await history.push(ctx, {
          action: 'CREATED',
          model: 'Flag',
          meta: {
            type
          },
          nodeId
        })

        algolia.updateNode(ctx, nodeId)
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

        await history.push(ctx, {
          action: 'DELETED',
          model: 'Flag',
          meta: {
            type
          },
          nodeId
        })

        algolia.updateNode(ctx, nodeId)
      }

      return ctx.prisma.query.zNode({ where: { id: nodeId } }, info)
    }
  }
}
