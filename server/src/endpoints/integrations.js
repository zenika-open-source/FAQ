const slack = require('../integrations/slack')

const integrationsEndpoint = multiTenant => async (req, res) => {
  if (req.params.name === 'slack') {
    return slack.respondToCommand(multiTenant.current(req), req, res)
  }

  res.status(404).send('Unknown integration')
}

module.exports = integrationsEndpoint
