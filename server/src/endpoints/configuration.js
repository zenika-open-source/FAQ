const { getConfiguration } = require('../middlewares/configuration')

const configurationEndpoint = multiTenant => async (req, res) =>
  getConfiguration(multiTenant, req, () => {
    const { title, auth0Domain, auth0ClientId, tags } = multiTenant.current(req)._meta.configuration

    res.header('Access-Control-Allow-Origin', '*')

    // An unauthenticated user can only access this part of the configuration
    res.json({
      title,
      auth0Domain,
      auth0ClientId,
      tags
    })
  })

module.exports = configurationEndpoint
