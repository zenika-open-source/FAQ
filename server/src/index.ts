import { GraphQLServer } from 'graphql-yoga'
import { PrismaClient } from '@prisma/client'
import { MultiTenant } from 'prisma-multi-tenant'
import cors from 'cors'

import schema from './schema'
import { createContext } from './context'
import { authenticate, errorHandling, tenantExists } from './middlewares'

require('dotenv').config({ path: '.env.local' })

const multiTenant = new MultiTenant<PrismaClient>()

/* Create server */

const server = new GraphQLServer({
  schema,
  context: createContext(multiTenant)
})

/* Registre middlewares */

server.express.use(cors())
server.express.post('/', [tenantExists(multiTenant), authenticate(multiTenant), errorHandling])

/* Start server */

server.start(
  {
    playground: process.env.NODE_ENV === 'production' ? false : '/'
  },
  () => console.log(`Server is running on http://localhost:4000`)
)

process.on('exit', async () => {
  await multiTenant.disconnect()
})
