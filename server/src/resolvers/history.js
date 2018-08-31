module.exports = {
  Query: {
    historyActions: (_, args, ctx, info) =>
      ctx.prisma.query.historyActions(args, info)
  }
}
