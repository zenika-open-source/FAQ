const fetch = require('isomorphic-fetch')
const FormData = require('form-data')

const answerText = require('./answer.text')
const answerHtml = require('./answer.html')

class Mailgun {
  constructor() {
    this.faq_url = process.env.FAQ_URL
    this.api_key = process.env.MAILGUN_API_KEY
    this.domain = process.env.MAILGUN_DOMAIN

    if (!this.faq_url || !this.api_key || !this.domain) {
      // eslint-disable-next-line no-console
      console.log(
        'Please provide the FAQ_URL, MAILGUN_API_KEY and MAILGUN env variables'
      )
    }

    this.token = Buffer.from(`api:${this.api_key}`).toString('base64')
    this.endpoint = `https://api.mailgun.net/v3/${this.domain}/messages`
  }

  async sendNewAnswer(ctx, nodeId) {
    const node = await ctx.prisma.query.zNode(
      { where: { id: nodeId } },
      `
      {
        id
        question {
          title
          slug
          user {
            name
            email
          }
        }
        answer {
          content
          user {
            name
          }
        }
      }
      `
    )

    const from = `FAQ Zenika <no-reply@${this.faq_url}>`
    const to = node.question.user.email
    const subject =
      node.answer.user.name + ' answered your question on the FAQ!'
    const text = answerText(node)
    const html = answerHtml(node)

    return this.sendMail(from, to, subject, text, html)
  }

  async sendMail(from, to, subject, text, html) {
    const form = new FormData()
    form.append('from', from)
    form.append('to', to)
    form.append('subject', subject)
    form.append('text', text)
    form.append('html', html)

    const response = await fetch(this.endpoint, {
      headers: {
        Authorization: `Basic ${this.token}`
      },
      method: 'POST',
      body: form
    }).then(response => response.json())

    return response
  }
}

const mailgun = new Mailgun()

module.exports = mailgun
