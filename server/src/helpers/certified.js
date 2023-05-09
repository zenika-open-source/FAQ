const questionDeleteCertifWhenNotSpecialist = async (node, tags, ctx) => {
  const certifiedFlag = node.flags.find(flag => flag.type === 'certified')
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
    }
  }
}

const answerUpdateCertif = async (answer, user, ctx) => {
  const certifiedFlag = answer.node.flags.find(flag => flag.type === 'certified')
  const tags = answer.node.tags.map(tag => tag.label.id)
  const specialties = user.specialties
  const isUserSpecialist = Boolean(specialties.find(specialty => tags.includes(specialty.id)))

  if (isUserSpecialist && !certifiedFlag) {
    await ctx.prisma.mutation.createFlag({
      data: {
        type: 'certified',
        node: { connect: { id: answer.node.id } },
        user: { connect: { id: user.id } }
      }
    })
  } else if (!isUserSpecialist && certifiedFlag) {
    await ctx.prisma.mutation.deleteFlag({
      where: { id: certifiedFlag.id }
    })
  }
}

module.exports = {
  questionDeleteCertifWhenNotSpecialist,
  answerUpdateCertif
}
