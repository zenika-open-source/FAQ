const { algolia } = require('./integrations')
const { refreshConfiguration } = require('../middlewares/configuration')

module.exports = {
  Query: {
    configuration: (_, args, ctx, info) =>
      ctx.prisma.query.configuration({ where: { name: 'default' } }, info)
  },
  Mutation: {
    updateConfiguration: async (_, args, ctx, info) => {
      const configuration = await ctx.prisma.mutation.updateConfiguration(
        { where: { name: 'default' }, data: args },
        info
      )

      algolia.resyncSynonyms(ctx, args.algoliaSynonyms)

      refreshConfiguration(ctx.prisma)

      return configuration
    }
  }
}
