const { MultiTenant } = require('prisma-multi-tenant')
const { PrismaClient } = require('@prisma/client')
const logger = require('./helpers/logger')

const multiTenant = new MultiTenant({
  instanciate: (name, stage) => {
    const endpoint = process.env.PRISMA_URL + '/' + name + '/' + stage
    logger.info(
      `instanciating prisma client for service "${name}", stage "${stage}", and endpoint "${endpoint}"`
    )
    return new PrismaClient()
  },
  nameStageFromReq: req => {
    // Env vars take precedence
    if (process.env.SERVICE_NAME) {
      const [name, stage] = [process.env.SERVICE_NAME, process.env.SERVICE_STAGE || 'prod']
      return [name, stage]
    }

    // Prefered header: faq-tenant
    if (req.headers['faq-tenant']) {
      const [name, stage] = req.headers['faq-tenant'].match(/([^/]+)\/([^/]+)/).splice(1, 2)
      return [name, stage]
    }

    // Alternative header (legacy): prisma-service
    if (req.headers['prisma-service']) {
      const [name, stage] = req.headers['prisma-service'].match(/([^/]+)\/([^/]+)/).splice(1, 2)
      return [name, stage]
    }

    // If no header found, try to guess using the host
    const hostParts = req.hostname.split('.')

    const [, , name = 'default', stage = 'prod'] = hostParts.reverse()
    return [name, stage]
  }
})

module.exports = multiTenant
