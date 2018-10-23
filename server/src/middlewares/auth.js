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

  const authType =
    req.headers.authorization && req.headers.authorization.split(' ')[0]

  req.authType = authType

  if (authType === 'Bearer') {
    jwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 1,
        jwksUri: `https://${conf.auth0Domain}/.well-known/jwks.json`
      }),
      credentialsRequired: true,
      audience: conf.auth0ClientId,
      issuer: `https://${conf.auth0Domain}/`,
      algorithms: ['RS256']
    })(req, res, next)
  } else if (authType === 'API') {
    jwt({
      secret: (req, payload, done) => {
        if (req.headers['prisma-service'] !== payload['prisma-service']) {
          done(
            new jwt.UnauthorizedError(
              'wrong-prisma-service',
              'Wrong prisma-service found in JWT Payload'
            )
          )
        }
        prisma.query
          .user({ where: { id: payload['user-id'] } }, '{ id key }')
          .then(user => done(null, user.key))
      },
      credentialsRequired: true,
      algorithms: ['HS256'],
      getToken: req =>
        req.headers.authorization && req.headers.authorization.split(' ')[1]
    })(req, res, next)
  } else {
    throw new Error('Authentication type not supported: ' + authType)
  }
}

const getUser = async (req, res, next, prisma) => {
  if (!req.user) return next()

  if (req.authType === 'Bearer') {
    const user = await prisma.query.user({
      where: { auth0Id: req.user.sub.split('|')[1] }
    })
    req.user = { token: req.user, ...user }
  } else if (req.authType === 'API') {
    const user = await prisma.query.user({
      where: { id: req.user['user-id'] }
    })
    req.user = user
  }
  next()
}

module.exports = { checkJwt, getUser }
