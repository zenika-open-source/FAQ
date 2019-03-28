const auth = require('./auth')
const error = require('./error')
const { getConfiguration } = require('./configuration')
const { getFirstUserFlag } = require('./first-user')

module.exports = { auth, error, getConfiguration, getFirstUserFlag }
