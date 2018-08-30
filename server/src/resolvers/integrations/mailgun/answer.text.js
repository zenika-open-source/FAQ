const answerText = node => `
Hi ${node.question.user.name}!

${node.answer.user.name} answered your question titled "${node.question.title}":

#####

${node.answer.content}

#####

You can read the answer and it's sources on https://${
  process.env['FAQ_URL']
}/q/${node.question.slug}-${node.id}
`

module.exports = answerText
