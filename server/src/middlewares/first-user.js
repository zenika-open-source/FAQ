const getFirstUserFlag = async (multiTenant, req, next) => {
  const tenant = multiTenant.current(req)

  if (tenant._meta.isFirstUser) {
    next()
    return
  }

  await refreshFirstUserFlag(tenant).catch(next)

  next()
}

const refreshFirstUserFlag = async tenant => {
  const count = (await tenant.query.usersConnection({}, '{ aggregate { count } }')).aggregate.count
  tenant._meta.isFirstUser = count === 0
}

module.exports = { getFirstUserFlag, refreshFirstUserFlag }
