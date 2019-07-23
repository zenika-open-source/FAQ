const { validateAndParseIdToken, ctxUser } = require('../helpers')
const { refreshFirstUserFlag } = require('../middlewares/first-user')

module.exports = {
  Query: {
    me: (_, args, ctx) =>
      ctx.photon.users.findOne({
        where: {
          id: ctxUser(ctx) ? ctxUser(ctx).id : ''
        }
      })
  },
  Mutation: {
    authenticate: async (_, { idToken }, ctx) => {
      let userToken = null
      const isFirstUser = ctx.photon._meta.isFirstUser
      try {
        userToken = await validateAndParseIdToken(idToken, ctx.photon._meta.configuration)
      } catch (err) {
        throw new Error(err.message)
      }
      const auth0Id = userToken.sub.split('|')[1]

      const user = await ctx.photon.users.upsert({
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
      })

      if (isFirstUser) {
        await refreshFirstUserFlag(ctx.photon)
      }

      return user
    },
    updateMe: (_, { name, email, picture }, ctx) =>
      ctx.photon.users.update({
        where: { id: ctxUser(ctx).id },
        data: { name, email, picture }
      }),
    forgetMe: (_, args, ctx) =>
      // TODO: Use real null value (See Notes.md)
      ctx.photon.users.update({
        where: { id: ctxUser(ctx).id },
        data: {
          name: 'Anonymous',
          email: '',
          picture: '/img/portrait_placeholder.png',
          auth0Id: 'null',
          key: 'null',
          locale: 'null'
        }
      })
  }
}
