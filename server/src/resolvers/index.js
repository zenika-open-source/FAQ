const userResolvers = require('./user')
const questionResolvers = require('./question')
const answerResolvers = require('./answer')
const flagResolvers = require('./flag')
const historyResolvers = require('./history')
const searchResolvers = require('./search')
const randomResolvers = require('./random')

const mergeResolvers = resolvers =>
  resolvers.reduce((acc, res) => {
    Object.keys(res).map(type => {
      if (!acc[type]) acc[type] = {}

      acc[type] = { ...acc[type], ...res[type] }
    })

    return acc
  }, {})

module.exports = mergeResolvers([
  userResolvers,
  questionResolvers,
  answerResolvers,
  flagResolvers,
  historyResolvers,
  searchResolvers,
  randomResolvers
])
