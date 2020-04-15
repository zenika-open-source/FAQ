import path from 'path'
import { makeSchema, fieldAuthorizePlugin } from 'nexus'
import { nexusPrismaPlugin } from 'nexus-prisma'
import * as types from './types'
const schema = makeSchema({
  types,
  plugins: [nexusPrismaPlugin(), fieldAuthorizePlugin()],
  outputs: {
    schema: path.join(__dirname, 'schema.graphql'),
    typegen: path.join(__dirname, '../../node_modules/@types/nexus-typegen/index.d.ts')
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'PrismaClient'
      },
      {
        source: require.resolve('./context'),
        alias: 'Context'
      }
    ]
  }
})

export default schema
