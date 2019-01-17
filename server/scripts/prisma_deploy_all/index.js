const { env, run, queryManagement } = require('../helpers')

const { PRISMA_URL } = env([
  'PRISMA_URL',
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

const deployPrismaService = (name, stage) => {
  const isForcing = process.argv.includes('--force')
  run('C:\\Users\\Tom\\FAQ\\server\\node_modules\\.bin\\prisma.cmd deploy' + (isForcing ? '--force' : ''), {
    PRISMA_URL: PRISMA_URL + '/' + name + '/' + stage
  })
}

const deployAlgoliaIndex = async (name, stage) => {
  console.log(
    run('node ../algolia_settings/index.js', {
      SERVICE_NAME: name,
      SERVICE_STAGE: stage
    }).toString()
  )
}

const main = async () => {
  const services = await getServices()
  services.map(({ name, stage }) => {
    deployPrismaService(name, stage)
    deployAlgoliaIndex(name, stage)
  })
}

main()
