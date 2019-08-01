const slack = require('../integrations/slack')

const integrationsEndpoint = multiTenant => async (req, res) => {
  if (req.params.name === 'slack') {
    const photon = await multiTenant.current(req)
    return slack.respondToCommand(photon, req, res)
  }

  res.status(404).send('Unknown integration')
}

module.exports = integrationsEndpoint
