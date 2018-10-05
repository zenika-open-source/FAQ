const { Prisma } = require('prisma-binding')
const { importSchema } = require('graphql-import')

class Instanciator {
  constructor() {
    this.instances = {}
  }

  current(req) {
    const service = req.headers['prisma-service']

    if (!service) {
      throw Error("No 'prisma-service' header found, please provide one")
    }

    const [name, stage] = service.match(/([^/]+)\/([^/]+)/).splice(1, 2)

    if (!name || !stage) {
      throw Error(
        `The 'prisma-service' header does not follow the 'name/stage' format (found: ${service})`
      )
    }

    if (!this.isInstanciated(name, stage)) this.instanciate(name, stage)

    return this.instances[name][stage]
  }

  isInstanciated(name, stage) {
    return this.instances[name] && this.instances[name][stage]
  }

  instanciate(name, stage) {
    let typeDefs = importSchema('src/generated/prisma.graphql')
    typeDefs += `# Service: ${name} / ${stage}`

    const instance = new Prisma({
      typeDefs: typeDefs,
      endpoint: process.env.PRISMA_URL + '/' + name + '/' + stage,
      secret: process.env.PRISMA_API_SECRET
    })

    instance._meta = {
      service: {
        name,
        stage
      }
    }

    if (!this.instances[name]) this.instances[name] = {}

    this.instances[name][stage] = instance

    return instance
  }
}

module.exports = Instanciator
