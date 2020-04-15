import { objectType, extendType, stringArg } from 'nexus'

import manager from '../integrations'

export const Flag = objectType({
  name: 'Flag',
  definition(t) {
    t.model.id()

    t.model.type()

    t.model.node()
    t.model.user()

    t.model.createdAt()
  }
})

export const AddFlag = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addFlag', {
      type: 'Node',
      args: {
        nodeId: stringArg({ required: true }),
        flag: stringArg({ required: true })
      },
      resolve: async (root, { nodeId, flag }, ctx) => {
        const flagExists = (
          await ctx.prisma.flag.findMany({
            where: { node: { id: nodeId }, type: flag }
          })
        )[0]

        if (!flagExists) {
          await ctx.prisma.flag.create({
            data: {
              type: flag,
              node: { connect: { id: nodeId } },
              user: { connect: { id: ctx.request.user.id } }
            }
          })

          await manager.trigger('flag-added', ctx, { nodeId, meta: { type: flag } })
        }

        return ctx.prisma.node.findOne({ where: { id: nodeId } })
      }
    })
  }
})

export const RemoveFlag = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('removeFlag', {
      type: 'Node',
      args: {
        nodeId: stringArg({ required: true }),
        flag: stringArg({ required: true })
      },
      resolve: async (root, { nodeId, flag }, ctx) => {
        const flagExists = (
          await ctx.prisma.flag.findMany({
            where: { node: { id: nodeId }, type: flag }
          })
        )[0]

        if (flagExists) {
          await ctx.prisma.flag.delete({
            where: { id: flagExists.id }
          })

          await manager.trigger('flag-removed', ctx, { nodeId, meta: { type: flag } })
        }

        return ctx.prisma.node.findOne({ where: { id: nodeId } })
      }
    })
  }
})
