const ctxUser = require('./ctxUser')

const history = {
  push: (ctx, { action, model, meta, nodeId, userId }) =>
    ctx.prisma.mutation.createHistoryAction({
      data: {
        action,
        model,
        meta,
        node: { connect: { id: nodeId } },
        user: { connect: { id: ctxUser(ctx).id } }
      }
    })
}

module.exports = history
