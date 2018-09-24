const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

if (!process.env.AUTH0_DOMAIN) {
  throw Error(
    'Missing env var: AUTH0_DOMAIN. You won\'t be able to authenticate into the app'
  )
}

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 1,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  credentialsRequired: false,
  audience: process.env.AUTH0_CLIENTID,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
  getToken: req => {
    const header = req.headers['authorization']
    if (!header) return 'bad_token'
    const parts = header.split(' ')
    if (parts.length !== 2) return 'bad_token'
    return parts[1]
  }
})

const getUser = async (req, res, next, prisma) => {
  if (!req.user) return next()

  const user = await prisma.query.user({
    where: { auth0Id: req.user.sub.split('|')[1] }
  })
  req.user = { token: req.user, ...user }

  next()
}

module.exports = { checkJwt, getUser }
