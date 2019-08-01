const { MultiTenant } = require('prisma-multi-tenant')

const name = process.argv[2]
if (!name) {
  console.error('No tenant name given as argument')
  process.exit(0)
}

const multiTenant = new MultiTenant()

async function main() {
  const photon = await multiTenant.get(name)

  await photon.configurations.create({
    data: {
      name: 'default',
      title: 'Dev',
      auth0Domain: process.env.AUTH0_DOMAIN,
      auth0ClientId: process.env.AUTH0_CLIENT_ID,
      algoliaAppId: process.env.ALGOLIA_APP_ID,
      algoliaApiKey: process.env.ALGOLIA_API_KEY,
      mailgunDomain: process.env.MAILGUN_DOMAIN,
      mailgunApiKey: process.env.MAILGUN_API_KEY,
      tags: `{"agencies": ["paris", "nantes"], "theme": ["tutorial", "meta"]}`
    }
  })

  console.log('Seeding done!')
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await multiTenant.disconnect()
  })
