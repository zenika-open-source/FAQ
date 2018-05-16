const { fromEvent } = require('graphcool-lib')
const { updateTags } = require('./tags')

const updateQuestionQuery = `
	mutation updateQuestion($id: ID!, $title: String!) {
		updateQuestion(id: $id, title: $title) {
			id
			slug
		}
	}
`

const updateNodeDummyQuery = `
	mutation updateNodeDummy($id: ID!) {
		updateZNode(id: $id, dummy: "dummy") {
			id
		}
	}
`

const updateQuestion = (graphcool, id, title) => {
  return graphcool.request(updateQuestionQuery, {
    id,
    title
  })
}

const updateNodeDummy = (graphcool, question) => {
  return graphcool.request(updateNodeDummyQuery, { id: question.nodeId })
}

export default async event => {
  const graphcool = fromEvent(event).api('simple/v1')

  const question = event.data

  const updatedQuestion = await updateQuestion(
    graphcool,
    question.id,
    question.title
  ).then(data => data.updateQuestion)

  const tags = await updateTags(graphcool, question)

  const dummy = await updateNodeDummy(graphcool, question)

  return {
    data: {
      id: updatedQuestion.id,
      slug: updatedQuestion.slug
    }
  }
}
