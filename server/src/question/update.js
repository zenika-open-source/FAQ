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

const updateQuestion = (graphcool, id, title) => {
  return graphcool.request(updateQuestionQuery, {
    id,
    title
  })
}

export default async event => {
  const graphcool = fromEvent(event).api('simple/v1')

  const question = event.data

  const updatedQuestion = updateQuestion(
    graphcool,
    question.id,
    question.title
  ).then(data => data.updateQuestion)

  const tags = updateTags(graphcool, question)

  const wait = await Promise.all([updatedQuestion, ...tags])

  const question = wait[0]

  return {
    data: {
      id: question.id,
      slug: question.slug
    }
  }
}
