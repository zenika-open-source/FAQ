const { history, ctxUser } = require('../helpers')
const { algolia } = require('../integrations')

module.exports = {
  Mutation: {
    addFlag: async (_, { type, nodeId }, ctx) => {
      const flags = await ctx.photon.flags.findMany({ where: { node: { id: nodeId }, type } })

      if (flags.length === 0) {
        await ctx.photon.flags.create({
          data: {
            type,
            node: { connect: { id: nodeId } },
            user: { connect: { id: ctxUser(ctx).id } }
          }
        })

        await history.push(ctx, {
          action: 'CREATED',
          model: 'Flag',
          meta: {
            type
          },
          nodeId
        })

        algolia.updateNode(ctx, nodeId)
      }

      return ctx.photon.nodes.findOne({
        where: { id: nodeId },
        include: {
          flags: { include: { user: true } }
        }
      })
    },
    removeFlag: async (_, { type, nodeId }, ctx) => {
      const flags = await ctx.photon.flags.findMany({
        where: { node: { id: nodeId }, type }
      })

      if (flags.length > 0) {
        await ctx.photon.flags.delete({
          where: { id: flags[0].id }
        })

        await history.push(ctx, {
          action: 'DELETED',
          model: 'Flag',
          meta: {
            type
          },
          nodeId
        })

        algolia.updateNode(ctx, nodeId)
      }

      return ctx.photon.nodes.findOne({
        where: { id: nodeId },
        include: {
          flags: { include: { user: true } }
        }
      })
    }
  }
}
