const { Prisma } = require('prisma-binding')
const { MultiTenant } = require('prisma-multi-tenant')

const multiTenant = new MultiTenant({
  instanciate: (name, stage) =>
    new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: process.env.PRISMA_URL + '/' + name + '/' + stage,
      secret: process.env.PRISMA_API_SECRET
    }),
  nameStageFromReq: req => {
    const service = req.headers['prisma-service']

    if (!service) {
      throw Error("No 'prisma-service' header found, please provide one")
    }

    return service.match(/([^/]+)\/([^/]+)/).splice(1, 2)
  }
})

module.exports = multiTenant
