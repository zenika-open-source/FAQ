const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = require('./resolvers')
const middlewares = require('./middlewares')

const auth = require('./middlewares/auth')

/* Create server */

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
})

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  middlewares,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: req => ({ ...req, prisma })
})

/* Register authentication middlewares */

server.express.post(
  server.options.endpoint,
  auth.checkJwt,
  (err, req, res, next) => {
    if (err) return res.status(401).json(err)
    next()
  }
)
server.express.post(server.options.endpoint, (req, res, next) =>
  auth.getUser(req, res, next, prisma)
)

/* Start server */

server.start(() =>
  // eslint-disable-next-line no-console
  console.log('GraphQL server is running on http://localhost:4000')
)
