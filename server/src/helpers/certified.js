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
      await ctx.prisma.mutation.deleteFlag({
        where: {
          id: certifiedFlag.id
        }
      })
      await deleteFlagAndUpdateHistoryAndAlgolia(history, type, ctx, certifiedFlag.id)
    }
  }
}

const answerAddCertifWhenSpecialist = async (user, node, nodeId, ctx) => {
  const tags = node.tags.map(tag => tag.label.id)
  const specialties = user.specialties
  const isUserSpecialist = Boolean(specialties.find(specialty => tags.includes(specialty.id)))

  if (isUserSpecialist) {
    await ctx.prisma.mutation.createFlag({
      data: {
        type: 'certified',
        node: { connect: { id: nodeId } },
        user: { connect: { id: user.id } }
      }
    })
  }
}

const refreshCertifiedFlag = async (history, answer, user, ctx) => {
  const certifiedFlag = answer.node.flags.find(flag => flag.type === type)
  const tags = answer.node.tags.map(tag => tag.label.id)
  const specialties = user.specialties
  const isUserSpecialist = Boolean(specialties.find(specialty => tags.includes(specialty.id)))

  if (isUserSpecialist && !certifiedFlag) {
    await ctx.prisma.mutation.createFlag({
      data: {
        type: type,
        node: { connect: { id: answer.node.id } },
        user: { connect: { id: user.id } }
      }
    })
    await createFlagAndUpdateHistoryAndAlgolia(history, type, ctx, answer.node.id)
  } else if (!isUserSpecialist && certifiedFlag) {
    await ctx.prisma.mutation.deleteFlag({
      where: { id: certifiedFlag.id }
    })
    await deleteFlagAndUpdateHistoryAndAlgolia(history, type, ctx, answer.node.id)
  }
}

module.exports = {
  answerAddCertifWhenSpecialist,
  deleteCertifedFlagIfNoLongerApplicable,
  refreshCertifiedFlag
}
