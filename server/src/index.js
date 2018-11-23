const { GraphQLServer } = require('graphql-yoga')
const express = require('express')
const secure = require('express-force-https')
const path = require('path')

const Instanciator = require('./instanciator.js')
const resolvers = require('./resolvers')
const directives = require('./directives')
const auth = require('./middlewares/auth')
const error = require('./middlewares/error')

/* Create server */

const yogaEndpoint = '/gql'

const instanciator = new Instanciator()

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  schemaDirectives: directives,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: ctx => ({
    ...ctx,
    prisma: instanciator.current(ctx.request),
    instanciator
  })
})

/* Register middlewares */

server.express.post(yogaEndpoint, [
  (req, res, next) => instanciator.getConfiguration(req, next),
  (req, res, next) => auth.checkJwt(req, res, next, instanciator.current(req)),
  error.handling
])

/* Register configuration endpoint */
server.express.get(yogaEndpoint + '/configuration', (req, res) =>
  instanciator.getConfiguration(req, () => {
    const { auth0Domain, auth0ClientId, tags } = instanciator.current(
      req
    )._meta.configuration

    res.header('Access-Control-Allow-Origin', '*')
    // An unauthenticated user can only access this part of the configuration
    res.json({
      auth0Domain,
      auth0ClientId,
      tags
    })
  })
)

/* Start server */

const port = process.env.PORT || 4000
const playgroundEndpoint = yogaEndpoint + '/playground'

server.start({ port, endpoint: yogaEndpoint, playground: playgroundEndpoint })

/* Serve frontend */

const frontPath = path.join(__dirname, '../front_build')

if (process.env.NODE_ENV === 'production') {
  server.express.use(secure)
}
server.express.use('/static', express.static(frontPath + '/static'))
server.express.use('/img', express.static(frontPath + '/img'))

server.express.get('*', (req, res, next) => {
  res.sendFile(frontPath + '/index.html')
})

// eslint-disable-next-line no-console
console.log('Server is successfuly running at http://localhost:' + port)
