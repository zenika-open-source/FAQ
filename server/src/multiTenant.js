const { Prisma } = require('prisma-binding')
const { MultiTenant } = require('prisma-multi-tenant')
const path = require('path')

const logger = require('./helpers/logger')

const multiTenant = new MultiTenant({
  instanciate: (name, stage) => {
    const endpoint = process.env.PRISMA_URL + '/' + name + '/' + stage
    logger.info(
      `instanciating prisma client for service "${name}", stage "${stage}", and endpoint "${endpoint}"`
    )
    return new Prisma({
      typeDefs: path.join(__dirname, '/generated/prisma.graphql'),
      endpoint,
      secret: process.env.PRISMA_API_SECRET
    })
  },
  nameStageFromReq: req => {
    // Env vars take precedence
    if (process.env.SERVICE_NAME) {
      const [name, stage] = [process.env.SERVICE_NAME, process.env.SERVICE_STAGE || 'prod']
      logger.info(
        `choosing service "${name}" and stage "${stage}" for incoming request because SERVICE_NAME is "${name}"`
      )
      return [name, stage]
    }

    // Prefered header: faq-tenant
    if (req.headers['faq-tenant']) {
      const [name, stage] = req.headers['faq-tenant'].match(/([^/]+)\/([^/]+)/).splice(1, 2)
      logger.info(
        `choosing service "${name}" and stage "${stage}" for incoming request because header "faq-tenant is "${req.headers['faq-tenant']}"`
      )
      return [name, stage]
    }

    // Alternative header (legacy): prisma-service
    if (req.headers['prisma-service']) {
      const [name, stage] = req.headers['prisma-service'].match(/([^/]+)\/([^/]+)/).splice(1, 2)
      logger.info(
        `choosing service "${name}" and stage "${stage}" for incoming request because header "prisma-service is "${req.headers['prisma-service']}"`
      )
      return [name, stage]
    }

    // If no header found, try to guess using the host
    const hostParts = req.hostname.split('.')

    const [, , name = 'default', stage = 'prod'] = hostParts.reverse()
    logger.info(
      `choosing service "${name}" and stage "${stage}" for incoming request because hostname is "${req.hostname}"`
    )
    return [name, stage]
  }
})

module.exports = multiTenant
