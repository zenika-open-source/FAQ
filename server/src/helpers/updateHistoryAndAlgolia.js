const { algolia } = require('../integrations')

const createFlagAndUpdateHistoryAndAlgolia = async (history, type, ctx, nodeId) => {
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

const deleteFlagAndUpdateHistoryAndAlgolia = async (history, type, ctx, nodeId) => {
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
