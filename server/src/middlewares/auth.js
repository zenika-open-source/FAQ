const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const { UnauthorizedError } = jwt

const checkJwt = (req, res, next, prisma) => {
  const {
    service: { name, stage },
    configuration: conf
  } = prisma._meta

  if (!conf.auth0Domain || !conf.auth0ClientId) {
    throw new Error(`No auth0 configuration found for service ${name}/${stage}!`)
  }

  const [authType, token] = (req.headers.authorization || '').split(' ')

  let options = {}
  let getUser = null

  const userQuery = id =>
    prisma.query.user(
      {
        where: { auth0Id: req.jwtCheckResult.sub.split('|')[1] }
      },
      `{
        id
        auth0Id
        admin
        name
        email
        picture
        locale
        currentGroup {
          id
          name
          slug
        }
      }`
    )

  if (authType === 'Bearer') {
    // Auth0 Authentication

    options = {
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 1,
        jwksUri: `https://${conf.auth0Domain}/.well-known/jwks.json`
      }),
      issuer: `https://${conf.auth0Domain}/`,
      audience: conf.auth0ClientId,
      algorithms: ['RS256']
    }

    getUser = async err => {
      if (err) return next(err)

      const user = await userQuery(req.jwtCheckResult.sub.split('|')[1])
      req.user = { token: req.jwtCheckResult, ...user }
      next()
    }
  } else if (authType === 'API') {
    // API Authentication

    options = {
      secret: (req, payload, done) => {
        if (!payload || req.headers['prisma-service'] !== payload.prismaService) {
          return done(
            new UnauthorizedError(
              'wrong-prisma-service',
              'Wrong prisma-service found in JWT Payload'
            )
          )
        }
        userQuery(payload['userId']).then(user => {
          req.user = user
          done(null, user.key)
        })
      },
      algorithms: ['HS256']
    }

    getUser = next
  } else {
    return next(
      new UnauthorizedError(
        'auth-type-unsupported',
        'Authentication type not supported: ' + authType
      )
    )
  }

  jwt({
    credentialsRequired: true,
    requestProperty: 'jwtCheckResult',
    getToken: () => token,
    ...options
  })(req, res, getUser)
}

module.exports = { checkJwt }
