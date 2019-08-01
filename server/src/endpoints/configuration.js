const { getConfiguration } = require('../middlewares/configuration')

const configurationEndpoint = multiTenant => async (req, res) =>
  getConfiguration(multiTenant, req, async err => {
    res.header('Access-Control-Allow-Origin', '*')

    if (err) {
      res.sendStatus(500)
      return
    }

    const photon = await multiTenant.current(req).catch(() => {
      res.sendStatus(500)
    })

    console.log(photon)

    const {
      title,
      auth0Domain,
      auth0ClientId,
      tags,
      workplaceSharing,
      bugReporting
    } = photon._meta.configuration

    // An unauthenticated user can only access this part of the configuration
    res.json({
      title,
      auth0Domain,
      auth0ClientId,
      tags,
      workplaceSharing,
      bugReporting
    })
  })

module.exports = configurationEndpoint
