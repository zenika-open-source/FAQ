const { forwardTo } = require('prisma-binding')

const questionResolvers = require('./question')

const mergeResolvers = (...resolvers) =>
  resolvers.reduce(
    (acc, resolver) => ({
      Query: { ...acc.Query, ...resolver.Query },
      Mutation: { ...acc.Mutation, ...resolver.Mutation }
    }),
    {
      Query: {},
      Mutation: {}
    }
  )

module.exports = mergeResolvers(questionResolvers)
