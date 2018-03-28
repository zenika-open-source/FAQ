const fromEvent = require('graphcool-lib').fromEvent

const htmlEmail = require('./onAnswerCreated.email.js').htmlCreate

const sendEmailQuery = `
	mutation sendEmail($to: [String!]!, $subject: String!, $text: String!, $html: String!){
		sendEmail(
			to: $to
			subject: $subject
			text: $text,
			html: $html
		) {
			success
			response
		}
	}
`

const createMail = node => {
  const text = `
Hi ${node.question.user.givenName}!

${node.answer.user.name} answered your question title "${node.question.title}":

#####

${node.answer.content}

#####

You can read the answer and it's sources on https://faq.zenika.com/q/${
  node.question.slug
}-${node.id}
`

  const html = htmlEmail(node)

  return {
    to: node.question.user.email,
    subject: 'Someone answered your question on the FAQ!',
    text: text,
    html: html
  }
}

export default async event => {
  const graphcool = fromEvent(event).api('simple/v1')

  const node = event.data.Answer.node.node

  const email = createMail(node)

  const resp = await graphcool.request(sendEmailQuery, email)

  return { data: { resp } }
}
