const fetch = require('isomorphic-fetch')

const algolia = require('./algolia')

const { emojify } = require('../helpers')

class Slack {
  async sendToChannel(ctx, nodeId) {
    const {
      service: { name, stage },
      configuration: conf
    } = ctx.photon._meta
    const origin = `${ctx.request.protocol}://${ctx.request.hostname}`

    if (!conf.slackChannelHook) {
      // eslint-disable-next-line no-console
      console.warn(`Please provide a slack channel hook for service ${name}/${stage}`)
      return
    }

    const node = await ctx.photon.nodes.findOne({
      where: { id: nodeId },
      include: { question: true, tags: true }
    })

    const url = origin + `/q/${node.question.slug}-${node.id}`
    const tags = node.tags.map(tag => `#${tag.label}`).join(', ')

    const title = emojify(this.escapeText(node.question.title))

    const message = {
      text: `<${url}|${title}>` + (tags ? ` (${tags})` : '')
    }

    return fetch(conf.slackChannelHook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
  }

  async respondToCommand(photon, req, res) {
    const origin = `${req.protocol}://${req.hostname}`
    const text = req.body.text
    const key = req.path.split('/').pop()

    const conf = await photon.configurations.findOne({ where: { name: 'default' } })

    if (!conf.slackCommandKey || conf.slackCommandKey !== key) {
      return res.send(
        this.buildMessage(
          'Oops, Slack did not provide the correct key. Please check the configuration of the FAQ plugin!'
        )
      )
    }

    if (!text) {
      return res.send(
        this.buildMessage(
          'The /faq command must always be followed by the text to search for.\nE.g.: /faq how to report an expense'
        )
      )
    }

    try {
      const results = await algolia.search({ photon }, { text, first: 3, skip: 0 })

      const items = results.hits.map(({ objectID, question, answer }) => ({
        title: question.title,
        title_link: `${origin}/${question.slug}-${objectID}`,
        text: answer.content || 'No answer yet...'
      }))

      items.push({
        title: `See "${text}" in FAQ`,
        title_link: `${origin}/?q=${text}`,
        text: `<${origin}/?q=${text}|See all results on FAQ>`
      })

      res.send(this.buildMessage(`Searching about: ${text}`, items, origin))
    } catch (err) {
      res.send(this.buildMessage('Oops, an unexpected error occured 😱'))
    }
  }

  escapeText(text) {
    return text.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
  }

  buildMessage(text, attachments, origin) {
    if (!attachments) return { text }

    return {
      response_type: 'in_channel',
      text,
      attachments: attachments.map(item => ({
        color: '#af1e3a',
        footer: origin,
        footer_icon: `${origin}/img/favicon/favicon-64.png`,
        ...item
      }))
    }
  }
}

const slack = new Slack()

module.exports = slack
