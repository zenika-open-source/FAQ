const fromEvent = require('graphcool-lib').fromEvent

const countZNodes = require('./queries').countZNodes
const getZNodeId = require('./queries').getZNodeId

const random = count => Math.floor(Math.random() * count)

export default async event => {
  const graphcool = fromEvent(event).api('simple/v1')

  const tag = event.data.tag
  const count = await countZNodes(graphcool, tag)
  const index = random(count)
  const id = await getZNodeId(graphcool, tag, index)

  return { data: { id } }
}
