const {
  env,
  queryManagement,
  queryService,
  deployPrismaService,
  deployAlgoliaIndex,
  fromArgs
} = require('../helpers')

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, ALGOLIA_APP_ID, ALGOLIA_API_KEY_ALL } = env([
  'PRISMA_URL', // Implicitely required
  'PRISMA_API_SECRET', // Implicitely required
  'PRISMA_MANAGEMENT_API_SECRET', // Implicitely required
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'ALGOLIA_APP_ID?',
  'ALGOLIA_API_KEY_ALL?'
])

const main = async () => {
  const [serviceName, serviceStage] = fromArgs()

  // Check if service already exists
  const service = await queryManagement(`
    {
      project(name: "${serviceName}", stage: "${serviceStage}") {
        name
        stage
      }
    }  
  `)
  if (service) {
    console.error(`Service ${serviceName}/${serviceStage} already exists`)
    process.exit(1)
  }

  // Deploy the service
  deployPrismaService(serviceName, serviceStage)

  // Add a default configuration
  const conf = await queryService(
    serviceName,
    serviceStage,
    `
      mutation {
        createConfiguration(
          data: {
            name: "default"
            auth0Domain: "${AUTH0_DOMAIN}"
            auth0ClientId: "${AUTH0_CLIENT_ID}"
            algoliaAppId: "${ALGOLIA_APP_ID || ''}"
            algoliaApiKey: "${ALGOLIA_API_KEY_ALL || ''}"
          }
        ) {
          id
        }
      }
    `
  ).then(d => d.createConfiguration)

  // Add a default group
  await queryService(
    serviceName,
    serviceStage,
    `
      mutation {
        createGroup(
          data: {
            name: "general"
            slug: "general",
            configuration: {
              connect: {
                id: "${conf.id}"
              }
            }
          }
        ) {
          id
        }
      }
    `
  )

  // Deploy algolia index
  await deployAlgoliaIndex(serviceName, serviceStage, 'general')

  // Log success
  console.log(`Successfully deployed a new service (${serviceName}/${serviceStage})!`)
}

main()
