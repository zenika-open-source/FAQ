const mjml2html = require('mjml').default
const Converter = require('showdown').Converter
const XSSFilter = require('showdown-xss-filter')
const { requireText, emojify } = require('../../../helpers')

const answer = {
  generateHtml: variables => mjml2html(requireText('./answer.mjml', require, variables)).html,
  generateText: variables => requireText('./answer.txt', require, variables),
  generateMail(node, conf, ctx) {
    const showdown = new Converter({
      openLinksInNewWindow: true,
      backslashEscapesHTMLTags: true,
      extensions: [XSSFilter]
    })
    showdown.setFlavor('github')

    const { origin } = ctx.request.headers

    const variables = {
      content: node.answer.content,
      content_md: emojify(showdown.makeHtml(node.answer.content)),
      base_url: origin,
      user_name: node.question.user.name,
      answerer_name: node.answer.user.name,
      title: node.question.title,
      title_md: emojify(node.question.title),
      question_url: origin + '/q/' + node.question.slug + '-' + node.id
    }

    return {
      from: `FAQ Zenika <no-reply@${conf.mailgunDomain}>`,
      to: node.question.user.email,
      subject: node.answer.user.name + ' answered your question on the FAQ!',
      html: this.generateHtml(variables),
      text: this.generateText(variables)
    }
  }
}

module.exports = answer
