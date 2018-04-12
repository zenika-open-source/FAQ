const fromEvent = require('graphcool-lib').fromEvent

const countZNodes = require('./queries').countZNodes
const getZNodeId = require('./queries').getZNodeId

const random = count => Math.floor(Math.random() * count)

export default async event => {
  const graphcool = fromEvent(event).api('simple/v1')

  const flag = event.data.flag
  const count = await countZNodes(graphcool, flag)
  const index = random(count)
  const id = await getZNodeId(graphcool, flag, index)

  return { data: { id } }
}
