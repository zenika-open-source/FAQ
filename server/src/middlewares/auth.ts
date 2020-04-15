import { PrismaClient } from '@prisma/client'
import { MultiTenant } from 'prisma-multi-tenant'
import { RequestHandler } from 'express'
import { UnauthorizedError } from 'express-jwt'
import * as admin from 'firebase-admin'

import { loadTenant } from '../context'
import { FaqError } from '../helpers'

admin.initializeApp()

export const authenticate = (multiTenant: MultiTenant<PrismaClient>): RequestHandler => async (
  req,
  res,
  next
): Promise<any> => {
  if (!req.headers.authorization) {
    return next(
      new UnauthorizedError('credentials_required', { message: 'No authorization header found' })
    )
  }

  await admin
    .auth()
    .verifyIdToken(req.headers.authorization.replace('Bearer ', ''))
    .then(async firebaseUser => {
      const prisma = await loadTenant(multiTenant, req)

      const user = await prisma.user.findOne({ where: { id: firebaseUser.user_id } })
      // @ts-ignore
      req.user = user
      // @ts-ignore
      req.firebaseUser = firebaseUser

      // If this is a new user, verify that he can register to the tenant
      if (!user) {
        const userDomain = firebaseUser.email.split('@').pop()
        const authorizedDomains = JSON.parse(prisma._meta.configuration.authorizedDomains || '[]')

        if (authorizedDomains.length > 0 && !authorizedDomains.includes(userDomain)) {
          return next(
            new FaqError(
              'unauthorized-email-domain',
              'You are not authorized to register to this tenant'
            )
          )
        }
      }

      next()
    })
    .catch(next)
}
