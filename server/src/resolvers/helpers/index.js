const slug = require('slugify')

const validateAndParseIdToken = require('./validateAndParseIdToken')
const history = require('./history')
const emojify = require('./emojify')
const requireText = require('./require-text')

const ctxUser = ctx => ctx.request.user
const slugify = s => slug(s).toLowerCase()

module.exports = {
  validateAndParseIdToken,
  history,
  ctxUser,
  slugify,
  emojify,
  requireText
}
