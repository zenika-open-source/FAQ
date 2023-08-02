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
  const conf = await tenant.query.configuration(
    {
      where: { name: 'default' }
    },
    `{
      id
      name
      title
      auth0Domain
      auth0ClientId
      authorizedDomains
      algoliaAppId
      algoliaApiKey
      algoliaSynonyms
      mailgunDomain
      mailgunApiKey
      slackChannelHook
      tagCategories {
        id
        order
        name
        labels {
          id
          order
          name
        }
      }
      workplaceSharing
      bugReporting
    }`
  )
  if (!conf) {
    throw new TypeError(
      `could not find configuration with name "default" for service "${tenant._meta.service.name}" and stage "${tenant._meta.service.stage}"`
    )
  }
  // TMP_TAGS
  tenant._meta.configuration = conf
}

module.exports = { getConfiguration, refreshConfiguration }
