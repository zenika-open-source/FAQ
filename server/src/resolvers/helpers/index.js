const slug = require('slug')

const validateAndParseIdToken = require('./validateAndParseIdToken')
const history = require('./history')
const ctxUser = require('./ctxUser')
const emojify = require('./emojify')

const slugify = s => slug(s).toLowerCase()

module.exports = { validateAndParseIdToken, history, ctxUser, slugify, emojify }
