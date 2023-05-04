const questionDeleteCertif = (node, user, tags, ctx) => {
  const flags = node.flags
  const specialties = user.specialties
  const specialtyTagMatch = Boolean(specialties.find(specialty => tags.includes(specialty.id)))

  !specialtyTagMatch &&
    flags.find(
      flag =>
        flag.type === 'certified' &&
        ctx.prisma.mutation.deleteFlag({
          where: {
            id: flag.id
          }
        })
    )
}

const answerUpdateCertif = (answer, user, ctx) => {
  const certified = answer.node.flags.find(flag => flag.type === 'certified')
  const tags = answer.node.tags.map(tag => tag.label.id)
  const specialties = user.specialties
  const specialtyTagMatch = Boolean(specialties.find(specialty => tags.includes(specialty.id)))

  if (specialtyTagMatch && !certified) {
    ctx.prisma.mutation.createFlag({
      data: {
        type: 'certified',
        node: { connect: { id: answer.node.id } },
        user: { connect: { id: user.id } }
      }
    })
  } else if (!specialtyTagMatch && certified) {
    ctx.prisma.mutation.deleteFlag({
      where: { id: certified.id }
    })
  }
}

module.exports = {
  questionDeleteCertif,
  answerUpdateCertif
}
