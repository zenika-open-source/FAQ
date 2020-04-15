import { objectType, enumType, extendType, stringArg, booleanArg, arg } from 'nexus'

import { isAdmin, randomString, diffTags } from '../helpers'
import manager from '../integrations'

export const Configuration = objectType({
  name: 'Configuration',
  definition(t) {
    t.model.id()
    t.model.title()

    t.string('authorizedDomains', {
      list: true,
      authorize: isAdmin,
      resolve: parent => JSON.parse(parent.authorizedDomains)
    })
    t.field('algoliaSynonyms', {
      type: 'AlgoliaSynonym',
      list: true,
      authorize: isAdmin,
      resolve: parent => JSON.parse(parent.algoliaSynonyms)
    })
    t.string('slackChannelHook', {
      nullable: true,
      authorize: isAdmin,
      resolve: parent => parent.slackChannelHook
    })
    t.string('slackCommandKey', {
      nullable: true,
      authorize: isAdmin,
      resolve: parent => parent.slackCommandKey
    })

    t.model.workplaceSharing()
    t.model.bugReporting()

    t.model.tagCategories()
  }
})

export const BugReporting = enumType({
  name: 'BugReporting',
  members: ['MAIL', 'GITHUB']
})

export const AlgoliaSynonym = objectType({
  name: 'AlgoliaSynonym',
  definition(t) {
    t.string('objectID', {
      // @ts-ignore
      resolve: parent => parent.objectID
    })
    t.string('type', {
      // @ts-ignore
      resolve: parent => parent.type
    })
    t.string('synonyms', {
      list: true,
      // @ts-ignore
      resolve: parent => parent.synonyms
    })
  }
})

export const ConfigurationQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('configuration', {
      type: 'Configuration',
      resolve: async (root, args, ctx) =>
        ctx.prisma.configuration.findOne({ where: { name: 'default' } })
    })
  }
})

export const UpdateConfiguration = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateConfiguration', {
      type: 'Configuration',
      args: {
        title: stringArg({ nullable: true }),
        authorizedDomains: stringArg({ nullable: true, list: true }),
        algoliaSynonyms: stringArg({ nullable: true }),
        slackChannelHook: stringArg({ nullable: true }),
        slackCommandKey: stringArg({ nullable: true }),
        workplaceSharing: booleanArg({ nullable: true }),
        bugReporting: arg({ nullable: true, type: 'BugReporting' }),
        tagCategories: stringArg({ nullable: true })
      },
      resolve: async (
        root,
        {
          title,
          authorizedDomains,
          tagCategories,
          algoliaSynonyms,
          workplaceSharing,
          slackChannelHook
        },
        ctx
      ) => {
        const updateData: { [key: string]: string | boolean } = {}

        if (title) {
          updateData.title = title
        }

        if (authorizedDomains) {
          updateData.authorizedDomains = JSON.stringify(authorizedDomains)
        }

        if (tagCategories) {
          await diffTags(ctx, tagCategories)
        }

        if (algoliaSynonyms) {
          updateData.algoliaSynonyms = algoliaSynonyms
        }

        if (workplaceSharing) {
          updateData.workplaceSharing = workplaceSharing
        }

        if (slackChannelHook) {
          updateData.slackChannelHook = slackChannelHook
        }

        await manager.trigger('configuration-updated', ctx, { updates: updateData })

        const conf = await ctx.prisma.configuration.update({
          where: { name: 'default' },
          data: updateData
        })

        return conf
      }
    })
  }
})

export const RegenerateSlackCommandKey = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('regenerateSlackCommandKey', {
      type: 'Configuration',
      resolve: (root, args, ctx) =>
        ctx.prisma.configuration.update({
          where: { name: 'default' },
          data: {
            slackCommandKey: randomString(20)
          }
        })
    })
  }
})
