import slug from 'slugify'

export { default as diffTags } from './diffTags'
export * from './errors'
export { default as randomString } from './randomString'

export const slugify = (s: string) => slug(s).toLowerCase()
// @ts-ignore
export const isAdmin = (root, args, ctx) => !!ctx.request.user.admin
// @ts-ignore
export const confTagLabels = ctx =>
  ctx.prisma._meta.configuration.tagCategories.reduce(
    (acc: any, cat: any) => acc.concat(cat.labels),
    []
  )
