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

  const userQuery = where =>
    prisma.query.user(
      {
        where
      },
      `{
        id
        auth0Id
        key
        admin
        name
        email
        picture
        locale
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

      const user = await userQuery({ auth0Id: req.jwtCheckResult.sub.split('|')[1] })
      req.user = { token: req.jwtCheckResult, ...user }
      next()
    }
  } else if (authType === 'API') {
    // API Authentication

    options = {
      secret: (req, payload, done) => {
        if (
          !payload ||
          req.headers['faq-tenant'] !== payload.faqTenant || // Prefered header: "faq-tenant"
          req.headers['prisma-service'] !== payload.prismaService // Alternative header (legacy): prisma-service
        ) {
          return done(
            new UnauthorizedError('wrong-faq-tenant', 'Wrong faq-tenant found in JWT Payload')
          )
        }
        userQuery({ id: payload['userId'] }).then(user => {
          req.user = user
          done(null, user.key)
        })
      },
      algorithms: ['HS256']
    }

    getUser = next
  } else if (process.env.AUTH_SKIP === 'skipAuth') {
    req.user = {
      id: 'clf9tpozq020u0870xl5bqw97',
      email: 'test.playwright@zenika.com',
      token: {
        email: 'test.playwright@zenika.com'
      }
    }
    return next()
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

const checkDomain = (req, res, next, prisma) => {
  const email = req.user.email || req.user.token.email

  const userDomain = email.split('@').pop()

  const domains = prisma._meta.configuration.authorizedDomains

  if (!domains || domains.length === 0) return next()

  if (req.user.admin) return next()

  if (domains.find(d => userDomain.endsWith(d))) return next()

  return next(new UnauthorizedError('wrong-domain-mail', 'Wrong domain mail'))
}

module.exports = { checkJwt, checkDomain }
