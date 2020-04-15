import { objectType, extendType, stringArg } from 'nexus'
import { FaqError } from '../helpers'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.email()

    t.model.admin()

    t.model.name()
    t.model.picture()
    t.model.locale()
  }
})

export const Me = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (root, args, ctx) => {
        if (!ctx.request?.user?.id) return null

        return ctx.prisma.user.findOne({ where: { id: ctx.request.user.id } })
      }
    })
  }
})

export const UpdateMe = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateMe', {
      type: 'User',
      args: {
        name: stringArg(),
        picture: stringArg()
      },
      resolve: (root, { name, picture }, ctx) =>
        ctx.prisma.user.update({
          where: { id: ctx.request.user.id },
          data: {
            name,
            picture
          }
        })
    })
  }
})

export const DeleteMe = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteMe', {
      type: 'User',
      resolve: async (root, args, ctx) => {
        if (ctx.request.user.admin) {
          const admins = await ctx.prisma.user.findMany({ where: { admin: true } })

          if (admins.length === 1) {
            throw new FaqError(
              'cannot-delete-last-admin',
              'You are the latest admin of the tenant, you cannot delete yourself.'
            )
          }
        }

        return ctx.prisma.user.update({
          where: { id: ctx.request.user.id },
          data: {
            name: 'Deleted User',
            email: 'deleted-email', // TODO: FIX THIS
            picture: '/img/portrait_placeholder.png',
            admin: false,
            key: null,
            locale: null
          }
        })
      }
    })
  }
})

export const Authenticate = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('authenticate', {
      type: 'User',
      args: {
        idToken: stringArg({ required: true })
      },
      resolve: async (root, { idToken }, ctx) => {
        // @ts-ignore
        const { uid, name, email, picture } = ctx.request.firebaseUser

        const user = await ctx.prisma.user.upsert({
          where: { id: uid },
          create: {
            id: uid,
            name: name,
            email: email,
            picture: picture
          },
          update: {
            picture: picture
          }
        })

        return user
      }
    })
  }
})
