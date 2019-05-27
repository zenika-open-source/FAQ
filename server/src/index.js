const { GraphQLServer } = require('graphql-yoga')
const express = require('express')
const secure = require('express-force-https')
const path = require('path')
const cors = require('cors')

const resolvers = require('./resolvers')
const directives = require('./directives')
const { auth, error, getConfiguration, getFirstUserFlag } = require('./middlewares')
const { configuration } = require('./endpoints')

const multiTenant = require('./multiTenant')

/* Create server */

const yogaEndpoint = '/gql'

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  schemaDirectives: directives,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: ctx => ({
    ...ctx,
    prisma: multiTenant.current(ctx.request)
  })
})

/* Register middlewares */

server.express.use(cors())

server.express.post(yogaEndpoint, [
  (req, res, next) => getConfiguration(multiTenant, req, next),
  (req, res, next) => getFirstUserFlag(multiTenant, req, next),
  (req, res, next) => auth.checkJwt(req, res, next, multiTenant.current(req)),
  (req, res, next) => auth.checkDomain(req, res, next, multiTenant.current(req)),
  error.handling
])

/* Register configuration endpoint */

server.express.get(yogaEndpoint + '/configuration', configuration(multiTenant))

/* Start server */

const port = process.env.PORT || 4000
const playgroundEndpoint = yogaEndpoint + '/playground'

server.start({ port, endpoint: yogaEndpoint, playground: playgroundEndpoint })

/* Serve frontend if env=prod */

if (process.env.NODE_ENV === 'production') {
  const frontPath = path.join(__dirname, '../front_build')

  server.express.use(secure)

  const staticPaths = ['static', 'img', '.well-known', 'manifest.json', 'robot.txt']

  staticPaths.map(path => server.express.use('/' + path, express.static(frontPath + '/' + path)))

  server.express.get('*', (req, res, next) => {
    res.sendFile(frontPath + '/index.html')
  })
}

// eslint-disable-next-line no-console
console.log('Server is successfuly running at http://localhost:' + port)
