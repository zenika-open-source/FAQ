const slug = require('slugify')

const { deleteCertifedFlagIfNoLongerApplicable, answerAddCertifWhenSpecialist, refreshCertifiedFlag } = require('./certified')
const diffTags = require('./diffTags')
const emojify = require('./emojify')
const history = require('./history')
const randomString = require('./randomString')
const requireText = require('./requireText')
const {
  createFlagAndUpdateHistoryAndAlgolia,
  deleteFlagAndUpdateHistoryAndAlgolia
} = require('./updateHistoryAndAlgolia')
const validateAndParseIdToken = require('./validateAndParseIdToken')

const ctxUser = ctx => ctx.request.user
const slugify = s => slug(s).toLowerCase()

module.exports = {
  ctxUser,
  answerAddCertifWhenSpecialist,
  deleteCertifedFlagIfNoLongerApplicable,
  refreshCertifiedFlag,
  diffTags,
  emojify,
  history,
  randomString,
  requireText,
  slugify,
  createFlagAndUpdateHistoryAndAlgolia,
  deleteFlagAndUpdateHistoryAndAlgolia,
  validateAndParseIdToken
}
