const Photon = require('@generated/photon')
const { MultiTenant } = require('prisma-multi-tenant')

const multiTenant = new MultiTenant()

module.exports = {
  current: req => {
    let name
    // Prefered header: faq-tenant
    if (req.headers['faq-tenant']) {
      name = req.headers['faq-tenant']
        .match(/([^/]+)\/([^/]+)/)
        .splice(1, 2)
        .join('$')
    }
    // Alternative header (legacy): prisma-service
    else if (req.headers['prisma-service']) {
      name = req.headers['prisma-service']
        .match(/([^/]+)\/([^/]+)/)
        .splice(1, 2)
        .join('$')
    }
    // If no header found, try to guess
    else {
      const hostParts = req.hostname.split('.')

      const [, , serviceName, serviceStage] = hostParts.reverse()

      name = `${serviceName || 'default'}$${serviceStage || 'prod'}`
    }
    return multiTenant.get(name)
  }
}
