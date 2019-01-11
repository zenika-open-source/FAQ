const fetch = require('isomorphic-fetch')

const { emojify } = require('../helpers')

class Slack {
  async sendToChannel(ctx, nodeId) {
    const {
      service: { name, stage },
      configuration: conf
    } = ctx.prisma._meta
    const { origin } = ctx.request.headers

    if (!conf.slackChannelHook) {
      // eslint-disable-next-line no-console
      console.warn(`Please provide a slack channel hook for service ${name}/${stage}`)
      return
    }

    const node = await ctx.prisma.query.zNode(
      { where: { id: nodeId } },
      `
      {
        id
        question {
          title
          slug
        }
        tags {
          label
        }
      }
      `
    )

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

  escapeText(text) {
    return text.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
  }
}

const slack = new Slack()

module.exports = slack
