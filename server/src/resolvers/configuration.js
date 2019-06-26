const { algolia } = require('../integrations')
const { refreshConfiguration } = require('../middlewares/configuration')
const { randomString } = require('../helpers')

module.exports = {
  Query: {
    configuration: (_, args, ctx, info) =>
      ctx.prisma.query.configuration({ where: { name: 'default' } }, info)
  },
  Mutation: {
    updateConfiguration: async (_, { authorizedDomains, ...args }, ctx, info) => {
      const configuration = await ctx.prisma.mutation.updateConfiguration(
        {
          where: { name: 'default' },
          data: { authorizedDomains: { set: authorizedDomains }, ...args }
        },
        info
      )

      algolia.resyncSynonyms(ctx, args.algoliaSynonyms)

      refreshConfiguration(ctx.prisma)

      return configuration
    },
    regenerateSlackCommandKey: (_, args, ctx, info) => {
      return ctx.prisma.mutation.updateConfiguration(
        {
          where: { name: 'default' },
          data: {
            slackCommandKey: randomString(20)
          }
        },
        info
      )
    }
  }
}
