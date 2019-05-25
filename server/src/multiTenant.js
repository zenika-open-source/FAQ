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
    // Prefered header: faq-tenant
    if (req.headers['faq-tenant']) {
      return req.headers['faq-tenant'].match(/([^/]+)\/([^/]+)/).splice(1, 2)
    }

    // Alternative header (legacy): prisma-service
    if (req.headers['prisma-service']) {
      return req.headers['prisma-service'].match(/([^/]+)\/([^/]+)/).splice(1, 2)
    }

    // If no header found, try to guess
    const hostParts = req.hostname.split('.')

    const [tld, main, serviceName, serviceStage] = hostParts.reverse()
    return [serviceName || 'default', serviceStage || 'prod']
  }
})

module.exports = multiTenant
