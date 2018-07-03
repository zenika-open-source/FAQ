const { GraphQLServer } = require('graphql-yoga')
const { Prisma, forwardTo } = require('prisma-binding')

const resolvers = require('./resolvers')

// If no resolver is defined, forward to Prisma
const defaultMiddleware = async (resolve, parent, args, ctx, info) => {
  let res = await resolve()

  if (res === undefined) {
    res = forwardTo('prisma')(parent, args, ctx, info)
  }

  return res
}

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  middlewares: [defaultMiddleware],
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466'
    })
  })
})

server.start(() =>
  console.log('GraphQL server is running on http://localhost:4000')
)
