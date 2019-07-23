const getConfiguration = async (multiTenant, req, next) => {
  const tenant = multiTenant.current(req)

  if (tenant._meta.configuration) {
    next()
    return
  }

  await refreshConfiguration(tenant).catch(next)
  next()
}

const refreshConfiguration = async tenant => {
  const conf = await tenant.configurations.findOne({ where: { name: 'default' } })

  // TODO: Use JSON deserializer instead (See Notes.md)
  // if (!conf.tags) conf.tags = {}
  conf.tags = conf.tags ? JSON.parse(conf.tags) : {}

  tenant._meta.configuration = conf
}

module.exports = { getConfiguration, refreshConfiguration }
