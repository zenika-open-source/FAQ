const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

const validateAndParseIdToken = (idToken, conf) =>
  new Promise((resolve, reject) => {
    const { header, payload } = jwt.decode(idToken, { complete: true })
    if (!header || !header.kid || !payload) reject(new Error('Invalid Token'))
    jwksClient({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 1,
      jwksUri: `https://${conf.auth0Domain}/.well-known/jwks.json`
    }).getSigningKey(header.kid, (err, key) => {
      if (err) reject(new Error('Error getting signing key: ' + err.message))
      jwt.verify(idToken, key.publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) reject(new Error('jwt verify error: ' + err.message))
        resolve(decoded)
      })
    })
  })

module.exports = validateAndParseIdToken
