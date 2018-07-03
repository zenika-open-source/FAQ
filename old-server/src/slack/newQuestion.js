const fetch = require('isomorphic-fetch')

const emojify = text => {
  let emoticons = {
    ':)': ':slightly_smiling_face:',
    ':(': ':slightly_frowning_face:',
    ':/': ':confused:',
    ':p': ':stuck_out_tongue:',
    ':P': ':stuck_out_tongue:',
    ':D': ':smiley:',
    ';)': ':wink:'
  }

  // Ascii emoticons to :emoji:
  return Object.keys(emoticons).reduce((text, emoticon) => {
    return text.split(emoticon + ' ').join(emoticons[emoticon] + ' ')
  }, text)
}

export default async event => {
  const channelHook = process.env['SLACK_CHANNEL_HOOK']

  if (!channelHook) {
    console.log('Please provide a valid slack channel hook!')
    return { error: 'Module not configured correctly.' }
  }

  const question = event.data.Question.node

  const url = `https://${process.env['FAQ_URL']}/q/${question.slug}-${
    question.node.id
  }`

  const message = {
    text: `<${url}|${emojify(question.title)}>`
  }

  const slackRequest = await fetch(channelHook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })

  const response = await slackRequest.text()

  return { data: { status: slackRequest.status, response } }
}
