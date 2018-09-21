const { GraphQLServer } = require('graphql-yoga')
const express = require('express')
const bodyParser = require('body-parser')
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

server.start(
  { port, endpoint: yogaEndpoint, playground: playgroundEndpoint },
  () => {
    // eslint-disable-next-line no-console
    console.log('Server is successfuly running at http://localhost:' + port)
  }
)

/* Serve frontend */

const front_path = path.join(__dirname, '../front_build')

server.express.use('/static', express.static(front_path + '/static'))
server.express.use('/img', express.static(front_path + '/img'))
//server.express.use(bodyParser.urlencoded({ extended: false }))
//server.express.use(bodyParser.json())

server.express.get('*', (req, res, next) => {
  res.sendFile(front_path + '/index.html')
})
