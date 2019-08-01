const algoliasearch = require('algoliasearch')
const { env } = require('../helpers')

const { MultiTenant } = require('prisma-multi-tenant')

const { TENANT_NAME } = env(['TENANT_NAME'])

const getAlgoliaCredentials = async name => {
  const multiTenant = new MultiTenant()
  const photon = await multiTenant.get(name)
  const configuration = await photon.configurations.findOne({ where: { name: 'default' } })
  await multiTenant.disconnect()
  return configuration
}

const updateSynonyms = (index, synonyms) => {
  return new Promise((resolve, reject) => {
    index.batchSynonyms(
      synonyms,
      {
        forwardToReplicas: true,
        replaceExistingSynonyms: true
      },
      (err, content) => {
        if (err) throw reject(err)
        resolve(content)
      }
    )
  })
}

const updateSettings = index => {
  return new Promise((resolve, reject) => {
    index.setSettings(
      {
        attributesForFaceting: ['filterOnly(tag)', 'filterOnly(flag)'],
        removeStopWords: ['en', 'fr']
      },
      (err, content) => {
        if (err) reject(err)
        resolve(content)
      }
    )
  })
}

const main = async () => {
  const credentials = await getAlgoliaCredentials(TENANT_NAME)

  if (!credentials || !credentials.algoliaAppId || !credentials.algoliaApiKey) {
    console.warn(`No algolia credentials found in configuration for ${TENANT_NAME}`)
    return
  }

  const client = algoliasearch(credentials.algoliaAppId, credentials.algoliaApiKey)

  const index = client.initIndex(TENANT_NAME.replace(/\$/g, '_'))

  await updateSynonyms(index, credentials.algoliaSynonyms || [])

  await updateSettings(index)

  console.log(`Deployed algolia settings for ${TENANT_NAME}`)
}

main()
