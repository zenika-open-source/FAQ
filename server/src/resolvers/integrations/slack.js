const fetch = require('isomorphic-fetch')

const { emojify } = require('../helpers')

class Slack {
  constructor() {
    this.channelHook = process.env['SLACK_CHANNEL_HOOK']

    if (!this.channelHook) {
      console.log('Please provide a valid slack channel hook!')
    }
  }
  async sendToChannel(ctx, nodeId) {
    const node = await ctx.prisma.query.zNode(
      { where: { id: nodeId } },
      `
      {
        id
        question {
          title
          slug
        }
      }
      `
    )

    const url =
      `https://${process.env['FAQ_URL']}/` +
      `q/${node.question.slug}-${node.id}`

    const message = {
      text: `<${url}|${emojify(node.question.title)}>`
    }

    return fetch(this.channelHook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
  }
}

const slack = new Slack()

module.exports = slack
