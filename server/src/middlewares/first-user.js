const getFirstUserFlag = async (multiTenant, req, next) => {
  const tenant = await multiTenant.current(req)

  if (tenant._meta.isFirstUser === undefined) {
    await refreshFirstUserFlag(tenant).catch(next)
  }

  next()
}

const refreshFirstUserFlag = async tenant => {
  // TODO: Use aggregation instead (See Notes.md)
  const count = (await tenant.users.findMany({ select: { id: true } })).length
  tenant._meta.isFirstUser = count === 0
}

const createFirstQuestion = async (photon, user) => {
  const node = await photon.nodes.create({
    data: {
      dummy: true
    }
  })

  await photon.questions.create({
    data: {
      title: "Welcome to the FAQ! What's next?",
      slug: 'welcome-to-the-faq-whats-next',
      user: {
        connect: {
          id: user.id
        }
      },
      node: {
        connect: { id: node.id }
      }
    }
  })

  await photon.answers.create({
    data: {
      content: 'TODO',
      user: {
        connect: {
          id: user.id
        }
      },
      node: {
        connect: { id: node.id }
      }
    }
  })
}

module.exports = { getFirstUserFlag, refreshFirstUserFlag, createFirstQuestion }
