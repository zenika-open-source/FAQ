// const { Photon } = require('@prisma/photon') // Uncomment for TypeScript support
const { MultiTenant } = require('prisma-multi-tenant')

// This is the name of your first tenant, try with another one
const name = 'db'

// If you are using Typescript, you can do "new MultiTenant<Photon>()" for autocompletion
const multiTenant = new MultiTenant()

async function main() {
  // Prisma-multi-tenant will connect to the correct tenant
  const photon = await multiTenant.get(name)

  // You keep the same interface as before
  const nodes = await photon.nodes.findMany()

  console.log(nodes)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await multiTenant.disconnect()
  })
