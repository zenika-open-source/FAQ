const { validateAndParseIdToken, ctxUser } = require('./helpers')

module.exports = {
  Query: {
    me: (_, args, ctx, info) =>
      ctx.prisma.query.user(
        {
          where: {
            id: ctxUser(ctx) ? ctxUser(ctx).id : ''
          }
        },
        info
      )
  },
  Mutation: {
    authenticate: async (_, { idToken, group }, ctx, info) => {
      let userToken = null
      try {
        userToken = await validateAndParseIdToken(idToken, ctx.prisma._meta.configuration)
      } catch (err) {
        throw new Error(err.message)
      }
      const auth0Id = userToken.sub.split('|')[1]

      return ctx.prisma.mutation.upsertUser(
        {
          where: { auth0Id },
          create: {
            auth0Id,
            name: userToken.name,
            email: userToken.email,
            picture: userToken.picture,
            locale: userToken.locale,
            currentGroup: { connect: { slug: group || 'general' } }
          },
          update: {
            picture: userToken.picture,
            ...(group ? { currentGroup: { connect: { slug: group } } } : {}) // Only update group is slug provided
          }
        },
        info
      )
    },
    updateMe: (_, { name, email, picture }, ctx, info) =>
      ctx.prisma.mutation.updateUser(
        {
          where: { id: ctxUser(ctx).id },
          data: { name, email, picture }
        },
        info
      ),
    changeCurrentGroup: (_, { group }, ctx, info) =>
      ctx.prisma.mutation.updateUser(
        {
          where: { id: ctxUser(ctx).id },
          data: { currentGroup: { connect: { id: group } } }
        },
        info
      )
  }
}
