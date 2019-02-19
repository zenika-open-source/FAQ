const { algolia } = require('./integrations')
const { refreshConfiguration } = require('../middlewares/configuration')

module.exports = {
  Query: {
    configuration: (_, args, ctx, info) =>
      ctx.prisma.query.configuration({ where: { name: 'default' } }, info),
    groups: (_, args, ctx, info) => ctx.prisma.query.groups(null, info)
  },
  Mutation: {
    updateConfiguration: async (_, { title, groups }, ctx, info) => {
      const configuration = await ctx.prisma.mutation.updateConfiguration(
        {
          where: { name: 'default' },
          data: {
            title,
            groups: {
              updateMany: groups.map(group => ({
                where: {
                  slug: group.slug
                },
                data: {
                  tags: group.tags,
                  algoliaSynonyms: group.algoliaSynonyms,
                  workplaceSharing: group.workplaceSharing
                }
              }))
            }
          }
        },
        info
      )

      groups.map(group => algolia.resyncSynonyms(ctx, group.algoliaSynonyms, group.slug))

      refreshConfiguration(ctx.prisma)

      return configuration
    }
  }
}
