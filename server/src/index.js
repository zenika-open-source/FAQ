const { GraphQLServer } = require('graphql-yoga')
const express = require('express')
const secure = require('express-force-https')
const path = require('path')

const Instanciator = require('./instanciator.js')
const resolvers = require('./resolvers')
const auth = require('./middlewares/auth')

/* Create server */

const yogaEndpoint = '/gql'

const instanciator = new Instanciator()

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: ctx => ({
    ...ctx,
    prisma: instanciator.current(ctx.request)
  })
})

/* Register authentication middlewares */

server.express.post(yogaEndpoint, auth.checkJwt, (err, req, res, next) => {
  if (err) return res.status(err.status || 500).json(err)
  next()
})
server.express.post(yogaEndpoint, (req, res, next) =>
  auth.getUser(req, res, next, instanciator.current(req))
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
