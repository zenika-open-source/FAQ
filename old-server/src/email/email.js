const fetch = require('isomorphic-fetch')
const FormData = require('form-data')

export default async event => {
  if (!process.env['MAILGUN_API_KEY']) {
    console.log('Please provide a valid mailgun secret key!')
    return { error: 'Module not configured correctly.' }
  }

  if (!process.env['MAILGUN_DOMAIN']) {
    console.log('Please provide a valid mailgun domain!')
    return { error: 'Module not configured correctly.' }
  }

  try {
    const token = new Buffer(`api:${process.env['MAILGUN_API_KEY']}`).toString(
      'base64'
    )
    const endpoint = `https://api.mailgun.net/v3/${
      process.env['MAILGUN_DOMAIN']
    }/messages`

    const from = `FAQ Zenika <no-reply@${process.env['FAQ_URL']}>`
    const { to, subject, text, html } = event.data
    const recipientVariables = event.data.recipientVariables || {}

    if (to.length > 10) {
      // Hardcoded to limit spam. Could be increased if needed
      return { error: 'Can\'t batch more than 10 emails!' }
    }

    const form = new FormData()
    form.append('from', from)

    for (var i = 0; i < to.length; i++) {
      form.append('to', to[i])
    }

    form.append('subject', subject)
    form.append('text', text)
    if (html) {
      form.append('html', html)
    }
    form.append('recipient-variables', JSON.stringify(recipientVariables))

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${token}`
      },
      method: 'POST',
      body: form
    }).then(response => response.json())

    return { data: { success: true, response: JSON.stringify(response) } }
  } catch (e) {
    console.log('Email could not be sent because an error occured:')
    console.log(e)
    return { error: 'An unexpected error occured while sending email.' }
  }
}
