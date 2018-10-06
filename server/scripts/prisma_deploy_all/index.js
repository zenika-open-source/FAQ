const { env, run, queryManagement, queryService } = require('../helpers')

const { PRISMA_URL, PRISMA_API_SECRET, PRISMA_MANAGEMENT_API_SECRET } = env([
  'PRISMA_URL',
  'PRISMA_API_SECRET',
  'PRISMA_MANAGEMENT_API_SECRET'
])

const getServices = () =>
  queryManagement(`
    {
      listProjects {
        name
        stage
      }
    }
  `).then(d => d.listProjects)

const deployPrismaService = (name, stage) =>
  run('prisma deploy', { PRISMA_URL: PRISMA_URL + '/' + name + '/' + stage })

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

const deployAlgoliaIndex = async (name, stage) => {
  const credentials = await getAlgoliaCredentials(name, stage)

  if (credentials && credentials.algoliaAppId && credentials.algoliaApiKey) {
    run('node ../algolia_settings/index.js', {
      ALGOLIA_APP_ID: credentials.algoliaAppId,
      ALGOLIA_API_KEY: credentials.algoliaApiKey,
      ALGOLIA_INDEX: name + '_' + stage
    })
  } else {
    console.warn(
      `No algolia credentials found in configuration for ${name}/${stage}`
    )
  }
}

const main = async () => {
  const services = await getServices()
  services.map(({ name, stage }) => {
    deployPrismaService(name, stage)
    deployAlgoliaIndex(name, stage)
  })
}

main()
