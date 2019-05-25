const history = {
  push: (ctx, { action, model, meta, nodeId, userId }) =>
    ctx.prisma.mutation.createHistoryAction({
      data: {
        action,
        model,
        meta,
        node: { connect: { id: nodeId } },
        user: { connect: { id: ctx.request.user.id } }
      }
    })
}

module.exports = history
