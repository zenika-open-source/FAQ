const { algolia } = require('../integrations')
const { history } = require('../helpers')

const createFlagAndUpdateHistoryAndAlgolia = async (type, ctx, nodeId) => {
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

const deleteFlagAndUpdateHistoryAndAlgolia = async (type, ctx, nodeId) => {
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
