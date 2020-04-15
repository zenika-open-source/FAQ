import { PrismaClient } from '@prisma/client'
import { MultiTenant } from 'prisma-multi-tenant'
import { RequestHandler } from 'express'

import { FaqError } from '../helpers'

export const tenantExists = (multiTenant: MultiTenant<PrismaClient>): RequestHandler => async (
  req,
  res,
  next
): Promise<any> => {
  const tenantHeader = req.headers['faq-tenant'] as string

  if (!tenantHeader) {
    return next(new FaqError('missing-faq-tenant-header', 'Missing faq-tenant header'))
  }

  if (!multiTenant.existsTenant(tenantHeader)) {
    return next(new FaqError('unknown-faq-tenant', 'Unknown faq tenant'))
  }

  next()
}
