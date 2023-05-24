const { algolia } = require('../integrations')

const createFlagAndUpdateHistoryAndAlgolia = async (history, type, ctx, nodeId, userId) => {
  await ctx.prisma.mutation.createFlag({
    data: {
      type: type,
      node: { connect: { id: nodeId } },
      user: { connect: { id: userId } }
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

const deleteFlagAndUpdateHistoryAndAlgolia = async (history, type, ctx, nodeId, flagId) => {
  await ctx.prisma.mutation.deleteFlag({
    where: {
      id: flagId
    }
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

module.exports = {
  createFlagAndUpdateHistoryAndAlgolia,
  deleteFlagAndUpdateHistoryAndAlgolia
}
