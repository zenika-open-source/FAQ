const Photon = require('@generated/photon')
const { MultiTenant } = require('prisma-multi-tenant')

const multiTenant = new MultiTenant({
  instanciate: (name, stage) =>
    new Photon({
      datasources: {
        db: {
          url:
            'file:/Users/errorname/Documents/Work/FAQ/server/prisma/' + name + '$' + stage + '.db'
        }
      }
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

    const [, , serviceName, serviceStage] = hostParts.reverse()
    return [serviceName || 'default', serviceStage || 'prod']
  }
})

module.exports = multiTenant
