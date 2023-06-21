const { getConfiguration } = require('../middlewares/configuration')

const configurationEndpoint = multiTenant => async (req, res) =>
  getConfiguration(multiTenant, req, err => {
    res.header('Access-Control-Allow-Origin', '*')

    if (err) {
      console.error('error while retrieving configuration', err)
      res.status(500).send(`Avez-vous bien fait la commande 'npm run new_service' ?`)
      return
    }

    // TMP_TAGS
    const {
      title,
      auth0Domain,
      auth0ClientId,
      tagCategories,
      workplaceSharing,
      bugReporting
    } = multiTenant.current(req)._meta.configuration

    // An unauthenticated user can only access this part of the configuration
    res.json({
      title,
      auth0Domain,
      auth0ClientId,
      tagCategories,
      workplaceSharing,
      bugReporting
    })
  })

module.exports = configurationEndpoint
