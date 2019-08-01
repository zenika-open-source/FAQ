const prompt = require('prisma-multi-tenant/build/cli/utils/prompt').default

const { env, run, deployAlgoliaIndex } = require('../helpers')

env([
  'AUTH0_DOMAIN', // Implicitely required
  'AUTH0_CLIENT_ID' // Implicitely required
])

const main = async () => {
  const { name, provider, url } = await prompt.tenantConf(process.argv.slice(2))

  if (name.split('$').length != 2) {
    console.error('An FAQ tenant name should be formatted like: [name]$[stage]')
    process.exit(1)
  }

  // Create new tenant
  await run(`prisma-multi-tenant new '--name=${name}' '--provider=${provider}' '--url=${url}'`)

  // Deploy algolia index
  await deployAlgoliaIndex(name)

  // Log success
  console.log(`Successfully deployed a new service (${name})!`)
}

main()
