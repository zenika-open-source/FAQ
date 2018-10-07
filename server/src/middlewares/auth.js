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
}

const getUser = async (req, res, next, prisma) => {
  if (!req.user) return next()

  const user = await prisma.query.user({
    where: { auth0Id: req.user.sub.split('|')[1] }
  })
  req.user = { token: req.user, ...user }

  next()
}

module.exports = { checkJwt, getUser }
