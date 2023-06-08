const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const { UnauthorizedError } = jwt

const checkJwt = async (req, res, next, prisma) => {
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

  const specialtyId = conf.subjectCategories[0].labels[1].id
  const userNoAuthUpsert = () =>
    prisma.mutation.upsertUser(
      {
        where: { auth0Id: 'faq-user-no-auth@zenika.com' },
        create: {
          auth0Id: 'faq-user-no-auth@zenika.com',
          admin: false,
          key: 'enableSkipAuth',
          name: 'enableSkipAuth',
          email: 'faq-user-no-auth@zenika.com',
          picture:
            'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
          specialties: { connect: { id: specialtyId } }
        },
        update: {
          auth0Id: 'faq-user-no-auth@zenika.com',
          admin: false,
          key: 'enableSkipAuth',
          name: 'enableSkipAuth',
          email: 'faq-user-no-auth@zenika.com',
          picture:
            'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'
        }
      },
      `{
        id
        email
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
  } else if (process.env.DISABLE_AUTH === 'true') {
    const user = await userNoAuthUpsert()
    req.user = {
      id: user.id,
      email: user.email,
      token: {
        email: user.email
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
