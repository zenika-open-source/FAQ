const getConfiguration = async (multiTenant, req, next) => {
  const tenant = multiTenant.current(req)

  if (tenant._meta.configuration) {
    next()
    return
  }

  try {
    await refreshConfiguration(tenant)
  } catch (err) {
    next(err)
    return
  }
  next()
}

const refreshConfiguration = async tenant => {
  const conf = await tenant.configuration.findUnique({
    where: { name: 'default' },
    select: {
      id: true,
      name: true,
      title: true,
      auth0Domain: true,
      auth0ClientId: true,
      authorizedDomains: true,
      algoliaAppId: true,
      algoliaApiKey: true,
      algoliaSynonyms: true,
      mailgunDomain: true,
      mailgunApiKey: true,
      slackChannelHook: true,
      tagCategories: {
        select: {
          id: true,
          order: true,
          name: true,
          labels: {
            select: {
              id: true,
              order: true,
              name: true
            }
          }
        }
      },
      workplaceSharing: true,
      bugReporting: true
    }
  })
  if (!conf) {
    throw new TypeError(
      `could not find configuration with name "default" for service "${tenant._meta.service.name}" and stage "${tenant._meta.service.stage}"`
    )
  }
  // TMP_TAGS
  tenant._meta.configuration = conf
}

module.exports = { getConfiguration, refreshConfiguration }
