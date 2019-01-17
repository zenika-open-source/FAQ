const { env, run, queryManagement, queryService } = require('../helpers')

const {
  PRISMA_URL,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  SERVICE_NAME,
  SERVICE_STAGE
} = env([
  'PRISMA_URL',
  'PRISMA_API_SECRET', // Implicitely required
  'PRISMA_MANAGEMENT_API_SECRET', // Implicitely required
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'SERVICE_NAME?',
  'SERVICE_STAGE?'
])

const main = async () => {
  const serviceName = SERVICE_NAME || 'default'
  const serviceStage = SERVICE_STAGE || 'default'
  const serviceUrl = PRISMA_URL + '/' + serviceName + '/' + serviceStage

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
  await run('C:\\Users\\Tom\\FAQ\\server\\node_modules\\.bin\\prisma.cmd deploy', {
    PRISMA_URL: serviceUrl
  })

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
            tags: "${JSON.stringify({
              agencies: ['paris', 'nantes'],
              theme: ['tutorial', 'meta']
            }).replace(/"/g, '\\"')}"
          }
        ) {
          id
          name
        }
      }
    `
  )

  // Log success
  console.log(
    `Successfully deployed a new service (${serviceName}/${serviceStage})!`
  )
}

main()
