const fetch = require('isomorphic-fetch')
const FormData = require('form-data')

const answer = require('./answer')

class Mailgun {
  async sendNewAnswer(ctx, nodeId) {
    const { name, configuration: conf } = ctx.photon._meta

    if (!conf.mailgunDomain || !conf.mailgunApiKey) {
      // eslint-disable-next-line no-console
      console.warn(`Please provide a mailgun domain and api key for service ${name}`)
      return null
    }

    const node = await this.getNode(ctx, nodeId)

    const mail = answer.generateMail(node, conf, ctx)

    return mail.to
      ? this.sendMail(mail, conf)
      : Promise.reject(new Error('Email not sent, no address found in user'))
  }

  async sendMail({ from, to, subject, text, html }, conf) {
    const token = Buffer.from(`api:${conf.mailgunApiKey}`).toString('base64')
    const endpoint = `https://api.eu.mailgun.net/v3/${conf.mailgunDomain}/messages`

    const form = new FormData()
    form.append('from', from)
    form.append('to', to)
    form.append('subject', subject)
    form.append('text', text)
    form.append('html', html)

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${token}`
      },
      method: 'POST',
      body: form
    }).then(response => response.json())

    return response
  }

  getNode(ctx, nodeId) {
    return ctx.photon.nodes.findOne({
      where: { id: nodeId },
      include: { question: { include: { user: true } }, answer: { include: { user: true } } }
    })
  }
}

const mailgun = new Mailgun()

module.exports = mailgun
