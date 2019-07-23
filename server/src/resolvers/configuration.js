const { algolia } = require('../integrations')
const { refreshConfiguration } = require('../middlewares/configuration')
const { randomString } = require('../helpers')

module.exports = {
  Query: {
    configuration: async (_, args, ctx) => {
      const configuration = await ctx.photon.configurations.findOne({ where: { name: 'default' } })

      // TODO: Don't manually deserialize JSON (See Notes.md)
      configuration.tags = JSON.parse(configuration.tags)
      configuration.algoliaSynonyms = JSON.parse(configuration.algoliaSynonyms)

      return configuration
    }
  },
  Mutation: {
    updateConfiguration: async (_, { authorizedDomains, tags, algoliaSynonyms, ...args }, ctx) => {
      // TODO: Don't manually serialize JSON (See Notes.md)
      const configuration = await ctx.photon.configurations.update({
        where: { name: 'default' },
        data: {
          authorizedDomains: { set: authorizedDomains },
          tags: JSON.stringify(tags),
          algoliaSynonyms: JSON.stringify(algoliaSynonyms),
          ...args
        }
      })

      algolia.resyncSynonyms(ctx, args.algoliaSynonyms)

      refreshConfiguration(ctx.photon)

      // TODO: Don't manually deserialize JSON (See Notes.md)
      configuration.tags = JSON.parse(configuration.tags)
      configuration.algoliaSynonyms = JSON.parse(configuration.algoliaSynonyms)

      return configuration
    },
    regenerateSlackCommandKey: (_, args, ctx) =>
      ctx.photon.configurations.update({
        where: { name: 'default' },
        data: {
          slackCommandKey: randomString(20)
        }
      })
  }
}
