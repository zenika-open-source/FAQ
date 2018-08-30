const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

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
  algorithms: ['RS256']
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
