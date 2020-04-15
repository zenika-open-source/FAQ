import { PrismaClient } from '@prisma/client'
import { MultiTenant } from 'prisma-multi-tenant'
import { Request } from 'express'

export type Context = {
  prisma: PrismaClient & PrismaClientMeta
  request: Express.Request & { user: { id: string; admin: Boolean } }
}

export type PrismaClientMeta = {
  _meta: { name: string; configuration: any }
}

export const loadTenant = async (multiTenant: MultiTenant<PrismaClient>, request: Request) => {
  const tenant = (request?.headers?.['faq-tenant'] as string) || 'demo'
  const prisma = (await multiTenant.get(tenant)) as PrismaClient & PrismaClientMeta

  if (!prisma._meta.configuration) {
    prisma._meta.configuration = await prisma.configuration.findOne({
      where: { name: 'default' },
      include: { tagCategories: { include: { labels: true } } }
    })
  }

  return prisma
}

export const createContext = (multiTenant: MultiTenant<PrismaClient>) => async (
  ctx: any
): Promise<Context> => {
  const prisma = await loadTenant(multiTenant, ctx.request)

  return {
    ...ctx,
    prisma
  }
}
