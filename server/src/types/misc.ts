import { objectType } from 'nexus'

export const PaginationMeta = objectType({
  name: 'PaginationMeta',
  definition(t) {
    t.int('entriesCount')
    t.int('pageCurrent')
    t.int('pagesCount')
  }
})
