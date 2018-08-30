const userResolvers = require('./user')
const questionResolvers = require('./question')
const answerResolvers = require('./answer')
const flagResolvers = require('./flag')
const randomResolvers = require('./random')

const mergeResolvers = resolvers =>
  resolvers.reduce(
    (acc, res) => ({
      Query: { ...acc.Query, ...res.Query },
      Mutation: { ...acc.Mutation, ...res.Mutation }
    }),
    { Query: {}, Mutation: {} }
  )

module.exports = mergeResolvers([
  userResolvers,
  questionResolvers,
  answerResolvers,
  flagResolvers,
  randomResolvers
])
