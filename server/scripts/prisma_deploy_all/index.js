const {
  env,
  deployPrismaService,
  deployAlgoliaIndex,
  queryManagement,
  queryService
} = require('../helpers')

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

const getGroups = (name, stage) =>
  queryService(
    name,
    stage,
    `
      {
        groups {
          slug
        }
      }
    `
  ).then(d => d.groups)

const main = async () => {
  const services = await getServices()

  services.map(async ({ name, stage }) => {
    deployPrismaService(name, stage)

    const groups = await getGroups(name, stage)

    groups.map(({ slug }) => {
      deployAlgoliaIndex(name, stage, slug)
    })
  })
}

main()
