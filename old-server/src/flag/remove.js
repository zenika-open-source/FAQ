const { fromEvent } = require('graphcool-lib')

const getFlag = `
  query getFlag($nodeId: ID!, $type: String!) {
    allFlags(filter: {node: {id: $nodeId}, type: $type}) {
      id
      type
      node {
        id
      }
    }
  }
`

const deleteFlag = `
  mutation deleteFlag($id: ID!) {
    deleteFlag(id: $id) {
      id
    }
  }
`

export default async event => {
  const graphcool = fromEvent(event).api('simple/v1')

  const { type, nodeId } = event.data

  const flag = await graphcool
    .request(getFlag, { nodeId, type })
    .then(d => d.allFlags[0])

  await graphcool.request(deleteFlag, { id: flag.id })

  return {
    data: {
      id: flag.id,
      type: flag.type,
      nodeId: flag.node.id
    }
  }
}
