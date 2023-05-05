const questionDeleteCertif = async (node, tags, ctx) => {
  const certified = node.flags.find(flag => flag.type === 'certified')
  const specialties = certified && certified.user.specialties
  const specialtyTagMatch =
    specialties && Boolean(specialties.find(specialty => tags.includes(specialty.id)))

  if (certified && !specialtyTagMatch) {
    ctx.prisma.mutation.deleteFlag({
      where: {
        id: certified.id
      }
    })
  }
}

const answerUpdateCertif = async (answer, user, ctx) => {
  const certified = answer.node.flags.find(flag => flag.type === 'certified')
  const tags = answer.node.tags.map(tag => tag.label.id)
  const specialties = user.specialties
  const specialtyTagMatch = Boolean(specialties.find(specialty => tags.includes(specialty.id)))

  if (specialtyTagMatch && !certified) {
    await ctx.prisma.mutation.createFlag({
      data: {
        type: 'certified',
        node: { connect: { id: answer.node.id } },
        user: { connect: { id: user.id } }
      }
    })
  } else if (!specialtyTagMatch && certified) {
    await ctx.prisma.mutation.deleteFlag({
      where: { id: certified.id }
    })
  }
}

module.exports = {
  questionDeleteCertif,
  answerUpdateCertif
}
