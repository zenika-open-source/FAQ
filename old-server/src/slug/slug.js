const fromEvent = require('graphcool-lib').fromEvent
const slug = require('slug')

const slugify = title => slug(title).toLowerCase()

const getQuestion = `
	query getQuestion($id: ID!) {
		Question(id: $id) {
			id
			title
			slug
		}
	}
`

const getQuestionBySlug = `
	query getQuestionBySlug($slug: String!) {
		allQuestions(filter: {slug_in: [$slug]}) {
			id
		}
	}
`

const getAvailableSlug = (graphcool, title, count, oldTitle, oldSlug) => {
  const slugTitle = slugify(title)

  count = count || 0

  return new Promise((resolve, reject) => {
    const slugWithCount = slugTitle + (count > 0 ? '-' + count : '')

    graphcool
      .request(getQuestionBySlug, {
        slug: slugWithCount
      })
      .then(data => {
        if (data.allQuestions.length == 0) {
          resolve(slugWithCount)
        } else {
          getAvailableSlug(graphcool, title, count + 1).then(slugTitle =>
            resolve(slugTitle)
          )
        }
      })
  })
}

export default async event => {
  const graphcool = fromEvent(event).api('simple/v1')

  const question = event.data

  const oldQuestion = (await graphcool.request(getQuestion, {
    id: question.id
  })).Question

  if (oldQuestion && slugify(question.title) === slugify(oldQuestion.title)) {
    event.data.slug = oldQuestion.slug
  } else {
    event.data.slug = await getAvailableSlug(graphcool, question.title)
  }

  return event
}
