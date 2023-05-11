const { validateAndParseIdToken, ctxUser } = require('../helpers')
const { refreshFirstUserFlag } = require('../middlewares/first-user')

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
      ),
    users: (_, args, ctx, info) => ctx.prisma.query.users({}, info)
  },
  Mutation: {
    authenticate: async (_, { idToken }, ctx, info) => {
      let userToken = null
      const isFirstUser = ctx.prisma._meta.isFirstUser
      try {
        userToken = await validateAndParseIdToken(idToken, ctx.prisma._meta.configuration)
      } catch (err) {
        throw new Error(err.message)
      }
      const auth0Id = userToken.sub.split('|')[1]

      const user = await ctx.prisma.mutation.upsertUser(
        {
          where: { auth0Id },
          create: {
            auth0Id,
            name: userToken.name,
            email: userToken.email,
            picture: userToken.picture,
            locale: userToken.locale,
            admin: isFirstUser
          },
          update: {
            picture: userToken.picture
          }
        },
        info
      )

      if (isFirstUser) {
        await refreshFirstUserFlag(ctx.prisma)
      }

      return user
    },
    updateMe: (_, { name, email, picture }, ctx, info) =>
      ctx.prisma.mutation.updateUser(
        {
          where: { id: ctxUser(ctx).id },
          data: { name, email, picture }
        },
        info
      ),
    forgetMe: (_, args, ctx, info) =>
      ctx.prisma.mutation.updateUser(
        {
          where: { id: ctxUser(ctx).id },
          data: {
            name: 'Anonymous',
            email: '',
            picture: '/img/portrait_placeholder.png',
            auth0Id: null,
            key: null,
            locale: null
          }
        },
        info
      ),
    updateSpecialties: async (_, { id, specialties }, ctx) => {
      ctx.prisma.mutation.updateUser({
        where: { id },
        data: { specialties: { connect: specialties } }
      })
    }
  }
}
