import { extendType, objectType, stringArg, intArg } from 'nexus'

import algolia from '../integrations/external/algolia'

export const SearchResult = objectType({
  name: 'SearchResult',
  definition(t) {
    t.field('nodes', {
      type: 'Node',
      list: true
    })

    t.field('meta', {
      type: 'PaginationMeta'
    })
  }
})

export const Search = extendType({
  type: 'Query',
  definition(t) {
    t.field('search', {
      type: 'SearchResult',
      args: {
        text: stringArg({ nullable: true }),
        tags: stringArg({ nullable: true, list: true }),
        flags: stringArg({ nullable: true, list: true }),
        first: intArg({ nullable: false }),
        skip: intArg({ nullable: false })
      },
      resolve: async (root, args, ctx) => {
        const argsWithDefault = {
          ...args,
          text: args.text || '',
          tags: args.tags || [],
          flags: args.flags || []
        }

        const { text, tags, flags, skip, first } = argsWithDefault

        let count
        let nodes

        const getNodes = (params: any) =>
          ctx.prisma.node.findMany({
            ...params,
            include: {
              question: true,
              answer: true,
              flags: true,
              tags: {
                include: {
                  label: true
                }
              }
            }
          })

        if (!text && tags.length == 0 && flags.length == 0) {
          // No specific search, returns recent nodes
          count = await ctx.prisma.node.count()

          nodes = await getNodes({
            orderBy: { createdAt: 'desc' },
            first,
            skip
          })
        } else {
          // Returns search from algolia
          const { ids, highlights, nbHits } = await algolia.search(ctx, argsWithDefault)

          count = nbHits

          nodes = await getNodes({
            where: {
              id: { in: ids }
            }
          })

          nodes = nodes
            .map(node => ({ ...node, highlights: highlights[node.id] }))
            .sort((a, b) => {
              // @ts-ignore
              return ids.indexOf(a.id) - ids.indexOf(b.id)
            })
        }

        return {
          nodes,
          meta: {
            pageCurrent: skip / first + 1,
            entriesCount: count,
            pagesCount: Math.ceil(count / first)
          }
        }
      }
    })
  }
})
