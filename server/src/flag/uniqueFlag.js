const fromEvent = require('graphcool-lib').fromEvent

const getFlags = `
  query getFlags($nodeId: ID!, $type: String!) {
    allFlags(filter: {node: {id: $nodeId}, type: $type}) {
      id
      type
    }
  }
`

export default async event => {
  const graphcool = fromEvent(event).api('simple/v1')

  const { nodeId, type } = event.data

  const flags = await graphcool.request(getFlags, { nodeId, type })

  if (flags.allFlags.length > 0) {
    return {
      error: `Flag "${type}" on node ${nodeId} already exists`
    }
  }

  return event
}
