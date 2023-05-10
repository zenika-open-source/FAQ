const slug = require('slugify')

const {
  questionDeleteCertifWhenNotSpecialist,
  answerAddCertifWhenSpecialist,
  answerUpdateCertif
} = require('./certified')
const diffTags = require('./diffTags')
const emojify = require('./emojify')
const history = require('./history')
const randomString = require('./randomString')
const requireText = require('./requireText')
const validateAndParseIdToken = require('./validateAndParseIdToken')

const ctxUser = ctx => ctx.request.user
const slugify = s => slug(s).toLowerCase()

module.exports = {
  ctxUser,
  questionDeleteCertifWhenNotSpecialist,
  answerAddCertifWhenSpecialist,
  answerUpdateCertif,
  diffTags,
  emojify,
  history,
  randomString,
  requireText,
  slugify,
  validateAndParseIdToken
}
