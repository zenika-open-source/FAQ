const history = {
  push: (ctx, { action, model, meta, nodeId }) =>
    ctx.photon.historyActions.create({
      data: {
        action,
        model,
        meta: JSON.stringify(meta),
        node: { connect: { id: nodeId } },
        user: { connect: { id: ctx.request.user.id } }
      }
    })
}

module.exports = history
