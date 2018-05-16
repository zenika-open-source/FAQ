const fromEvent = require('graphcool-lib').fromEvent
const { updateSources } = require('./sources')
const { deleteFlags } = require('./flags')

const updateAnswerQuery = `
	mutation updateAnswer($answerId: ID!, $content: String!) {
		updateAnswer(id: $answerId, content: $content) {
			id
		}
	}
`

const updateAnswer = (graphcool, answer) => {
  return graphcool.request(updateAnswerQuery, {
    answerId: answer.answerId,
    content: answer.content
  })
}

const updateNodeDummyQuery = `
	mutation updateNodeDummy($id: ID!) {
		updateZNode(id: $id, dummy: "dummy") {
			id
		}
	}
`

const updateNodeDummy = (graphcool, answer) => {
  return graphcool.request(updateNodeDummyQuery, { id: answer.nodeId })
}

export default async event => {
  const graphcool = fromEvent(event).api('simple/v1')

  const answer = event.data

  const updatedAnswer = updateAnswer(graphcool, answer)

  const sources = updateSources(graphcool, answer)

  const deletedFlags = deleteFlags(graphcool, answer)

  const wait = await Promise.all([updatedAnswer, sources, deletedFlags])

  const dummy = await updateNodeDummy(graphcool, answer)

  return { data: { id: answer.answerId } }
}
