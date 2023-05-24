const {
  deleteFlagAndUpdateHistoryAndAlgolia,
  createFlagAndUpdateHistoryAndAlgolia
} = require('./updateHistoryAndAlgolia')

const type = 'certified'

const deleteCertifedFlagIfNoLongerApplicable = async (history, node, tags, ctx) => {
  const certifiedFlag = node.flags.find(flag => flag.type === type)
  if (certifiedFlag) {
    const specialties = certifiedFlag && certifiedFlag.user.specialties
    const isUserSpecialist =
      specialties && Boolean(specialties.find(specialty => tags.includes(specialty.id)))

    if (!isUserSpecialist) {
      await deleteFlagAndUpdateHistoryAndAlgolia(
        history,
        type,
        ctx,
        certifiedFlag.id,
        certifiedFlag.id
      )
    }
  }
}

const refreshCertifiedFlag = async (history, answer, user, ctx) => {
  const certifiedFlag = answer.node.flags.find(flag => flag.type === type)
  const tags = answer.node.tags.map(tag => tag.label.id)
  const specialties = user.specialties
  const isUserSpecialist = Boolean(specialties.find(specialty => tags.includes(specialty.id)))

  if (isUserSpecialist && !certifiedFlag) {
    await createFlagAndUpdateHistoryAndAlgolia(history, type, ctx, answer.node.id, user.id)
  } else if (!isUserSpecialist && certifiedFlag) {
    await deleteFlagAndUpdateHistoryAndAlgolia(history, type, ctx, answer.node.id, answer.node.id)
  }
}

module.exports = {
  deleteCertifedFlagIfNoLongerApplicable,
  refreshCertifiedFlag
}
