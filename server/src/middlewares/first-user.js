const getFirstUserFlag = async (multiTenant, req, next) => {
  const tenant = await multiTenant.current(req)

  if (tenant._meta.isFirstUser) {
    next()
    return
  }

  await refreshFirstUserFlag(tenant).catch(next)

  next()
}

const refreshFirstUserFlag = async tenant => {
  // TODO: Use aggregation instead (See Notes.md)
  const count = (await tenant.users.findMany({ select: { id: true } })).length
  tenant._meta.isFirstUser = count === 0
}

module.exports = { getFirstUserFlag, refreshFirstUserFlag }
