const { getConfiguration } = require('../middlewares/configuration')

const configurationEndpoint = multiTenant => async (req, res) =>
  getConfiguration(multiTenant, req, () => {
    const { title, auth0Domain, auth0ClientId, tags, enableWorkplaceSharing } = multiTenant.current(
      req
    )._meta.configuration

    res.header('Access-Control-Allow-Origin', '*')

    // An unauthenticated user can only access this part of the configuration
    res.json({
      title,
      auth0Domain,
      auth0ClientId,
      tags,
      enableWorkplaceSharing
    })
  })

module.exports = configurationEndpoint
