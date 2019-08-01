const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const { UnauthorizedError } = jwt

const checkJwt = async (req, res, next, multiTenant) => {
  const photon = await multiTenant.current(req)
  const { name, configuration: conf } = photon._meta

  if (!conf.auth0Domain || !conf.auth0ClientId) {
    throw new Error(`No auth0 configuration found for tenant ${name}!`)
  }

  const [authType, token] = (req.headers.authorization || '').split(' ')

  let options = {}
  let getUser = null

  const userQuery = where =>
    photon.users.findOne({
      where
    })

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

      const user = await userQuery({ auth0Id: req.jwtCheckResult.sub.split('|')[1] }).catch(
        () => ({})
      )
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
        userQuery({ id: payload['userId'] })
          .then(user => {
            req.user = user
            done(null, user.key)
          })
          .catch(e => done(e))
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

const checkDomain = async (req, res, next, multiTenant) => {
  const photon = await multiTenant.current(req)

  const email = req.user.email || req.user.token.email

  const userDomain = email.split('@').pop()

  const domains = photon._meta.configuration.authorizedDomains

  if (!domains || domains.length === 0) return next()

  if (req.user.admin) return next()

  if (domains.find(d => userDomain.endsWith(d))) return next()

  return next(new UnauthorizedError('wrong-domain-mail', 'Wrong domain mail'))
}

module.exports = { checkJwt, checkDomain }
