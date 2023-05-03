const {
  env,
  queryManagement,
  queryService,
  deployPrismaService,
  deployAlgoliaIndex,
  fromArgs
} = require('../helpers')

const {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY_ALL,
  MAILGUN_DOMAIN,
  MAILGUN_API_KEY
} = env([
  'PRISMA_URL', // Implicitely required
  'PRISMA_API_SECRET', // Implicitely required
  'PRISMA_MANAGEMENT_API_SECRET', // Implicitely required
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'ALGOLIA_APP_ID?',
  'ALGOLIA_API_KEY_ALL?',
  'MAILGUN_DOMAIN?',
  'MAILGUN_API_KEY?'
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
  await queryService(
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
            mailgunDomain: "${MAILGUN_DOMAIN || ''}"
            mailgunApiKey: "${MAILGUN_API_KEY || ''}"
            tagCategories: {
              create: [
                {
                  name: "services",
                  order: 1,
                  labels: {
                    create: [
                      {name: "payroll", order: 1}
                      {name: "marketing", order: 2}
                      {name: "ce", order: 3}
                      {name: "sales", order: 4}
                    ]
                  }
                },
                {
                  name: "agencies",
                  order: 2,
                  labels: {
                    create: [
                      { name: "paris", order: 1 }
                      { name: "nantes", order: 2 }
                    ]
                  }
                },
                {
                  name: "theme",
                  order: 3,
                  labels: {
                    create: [
                      { name: "tutorial", order: 1 },
                      { name: "meta", order: 2 }
                    ]
                  }
                }
              ]
            }
          }
        ) {
          id
        }
      }
    `
  )

  // Deploy algolia index
  await deployAlgoliaIndex(serviceName, serviceStage)

  // Log success
  console.log(`Successfully deployed a new service (${serviceName}/${serviceStage})!`)
}

main()
