const { forwardTo } = require('prisma-binding')

module.exports = async (resolve, parent, args, ctx, info) => {
  let res = await resolve()

  if (res === undefined) {
    res = forwardTo('prisma')(parent, args, ctx, info)
  }

  return res
}
