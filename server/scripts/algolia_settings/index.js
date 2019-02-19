const algoliasearch = require('algoliasearch')
const { env, queryService } = require('../helpers')

const { SERVICE_NAME, SERVICE_STAGE, GROUP_SLUG } = env([
  'PRISMA_URL', // Implicitely required
  'PRISMA_API_SECRET', // Implicitely required
  'SERVICE_NAME',
  'SERVICE_STAGE',
  'GROUP_SLUG'
])

const getAlgoliaCredentials = (name, stage) =>
  queryService(
    name,
    stage,
    `
      {
        configuration (where:{name: "default"}) {
          algoliaAppId
          algoliaApiKey
        }
      }
    `
  ).then(data => (data ? data.configuration : null))

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
  const credentials = await getAlgoliaCredentials(SERVICE_NAME, SERVICE_STAGE)

  if (!credentials || !credentials.algoliaAppId || !credentials.algoliaApiKey) {
    console.warn(
      `No algolia credentials found in configuration for ${SERVICE_NAME}/${SERVICE_STAGE}`
    )
    return
  }

  const client = algoliasearch(credentials.algoliaAppId, credentials.algoliaApiKey)

  const index = client.initIndex(SERVICE_NAME + '_' + SERVICE_STAGE + '_' + GROUP_SLUG)

  await updateSynonyms(index, credentials.algoliaSynonyms || [])

  await updateSettings(index)

  console.log(`Deployed algolia settings for ${SERVICE_NAME}/${SERVICE_STAGE}/${GROUP_SLUG}`)
}

main()
