const { algolia } = require('./integrations')

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

      ctx.instanciator.refreshConfiguration(ctx.prisma)

      return configuration
    }
  }
}
