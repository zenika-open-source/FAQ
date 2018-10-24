const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

const checkJwt = (req, res, next, prisma) => {
  const {
    service: { name, stage },
    configuration: conf
  } = prisma._meta

  if (!conf.auth0Domain || !conf.auth0ClientId) {
    throw new Error(
      `No auth0 configuration found for service ${name}/${stage}!`
    )
  }

  const [authType, token] = (req.headers.authorization || '').split(' ')

  let secret = null
  let issuer = null
  let audience = null
  let algorithms = null
  let getUser = null

  if (authType === 'Bearer') {
    // Auth0 Authentication

    secret = jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 1,
      jwksUri: `https://${conf.auth0Domain}/.well-known/jwks.json`
    })

    issuer = `https://${conf.auth0Domain}/`
    audience = conf.auth0ClientId
    algorithms = ['RS256']

    getUser = async err => {
      if (err) next(err)

      const user = await prisma.query.user({
        where: { auth0Id: req.jwtCheckResult.sub.split('|')[1] }
      })
      req.user = { token: req.jwtCheckResult, ...user }
      next()
    }
  } else if (authType === 'API') {
    // API Authentication

    secret = (req, payload, done) => {
      if (
        payload &&
        req.headers['prisma-service'] !== payload['prisma-service']
      ) {
        done(
          new jwt.UnauthorizedError(
            'wrong-prisma-service',
            'Wrong prisma-service found in JWT Payload'
          )
        )
      }
      prisma.query.user({ where: { id: payload['user-id'] } }).then(user => {
        req.user = user
        done(null, user.key)
      })
    }

    algorithms = ['HS256']
    getUser = next
  } else {
    throw new Error('Authentication type not supported: ' + authType)
  }

  jwt({
    secret,
    credentialsRequired: true,
    algorithms,
    audience,
    issuer,
    requestProperty: 'jwtCheckResult',
    getToken: () => token
  })(req, res, getUser)
}

module.exports = { checkJwt }
