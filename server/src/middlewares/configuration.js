const getConfiguration = async (multiTenant, req, next) => {
  const tenant = multiTenant.current(req)

  if (tenant._meta.configuration) {
    next()
    return
  }

  try {
    await refreshConfiguration(tenant)
    next()
  } catch (err) {
    next(err)
  }
}

const refreshConfiguration = async tenant => {
  const conf = await tenant.query.configuration({
    where: { name: 'default' }
  })

  if (!conf.tags) conf.tags = []

  tenant._meta.configuration = conf
}

module.exports = { getConfiguration, refreshConfiguration }
