const slug = require('slugify')

const {
  deleteCertifedFlagIfNoLongerApplicable,
  addCertifiedFlagWhenSpecialist,
  refreshCertifiedFlag
} = require('./certified')
const diffTags = require('./diffTags')
const history = require('./history')
const randomString = require('./randomString')
const {
  createFlagAndUpdateHistoryAndAlgolia,
  deleteFlagAndUpdateHistoryAndAlgolia
} = require('./updateHistoryAndAlgolia')
const validateAndParseIdToken = require('./validateAndParseIdToken')

const ctxUser = ctx => ctx.request.user
const slugify = s => slug(s).toLowerCase()

module.exports = {
  ctxUser,
  addCertifiedFlagWhenSpecialist,
  deleteCertifedFlagIfNoLongerApplicable,
  refreshCertifiedFlag,
  diffTags,
  history,
  randomString,
  slugify,
  createFlagAndUpdateHistoryAndAlgolia,
  deleteFlagAndUpdateHistoryAndAlgolia,
  validateAndParseIdToken
}
