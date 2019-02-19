const { env, deployPrismaService, deployAlgoliaIndex, queryManagement } = require('../helpers')

env([
  'PRISMA_URL', // Implicitely required
  'PRISMA_API_SECRET', // Implicitely required
  'PRISMA_MANAGEMENT_API_SECRET' // Implicitely required
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

const main = async () => {
  const services = await getServices()

  services.map(({ name, stage }) => {
    deployPrismaService(name, stage)
    deployAlgoliaIndex(name, stage)
  })
}

main()
