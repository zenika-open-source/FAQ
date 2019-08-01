const { deployAlgoliaIndex, getTenants, run } = require('../helpers')

const main = async () => {
  await run(`prisma-multi-tenant lift up`)

  const services = await getTenants()

  services.map(({ name }) => {
    deployAlgoliaIndex(name)
  })
}

main()
