const { forwardTo } = require('prisma-binding')

const { validateAndParseIdToken, ctxUser } = require('./helpers')

const createPrismaUser = (ctx, idToken) =>
  ctx.prisma.mutation.createUser({
    data: {
      auth0Id: idToken.sub.split('|')[1],
      name: idToken.name,
      email: idToken.email,
      picture: idToken.picture,
      locale: idToken.locale
    }
  })

module.exports = {
  Query: {
    me: (_, args, ctx, info) =>
      ctx.prisma.query.user({ where: { id: ctxUser(ctx).id } })
  },
  Mutation: {
    authenticate: async (_, { idToken }, ctx, info) => {
      let userToken = null
      try {
        userToken = await validateAndParseIdToken(idToken)
      } catch (err) {
        throw new Error(err.message)
      }
      const auth0Id = userToken.sub.split('|')[1]
      /* let user = await ctx.prisma.query.user({ where: { auth0Id } }, info)
      if (!user) {
        user = createPrismaUser(ctx, userToken)
      } else {
        await updatePrismaUser(ctx, userToken)
      } */
      return ctx.prisma.mutation.upsertUser(
        {
          where: { auth0Id },
          create: {
            auth0Id,
            name: userToken.name,
            email: userToken.email,
            picture: userToken.picture,
            locale: userToken.locale
          },
          update: {
            picture: userToken.picture
          }
        },
        ctx,
        info
      )
    }
  }
}
