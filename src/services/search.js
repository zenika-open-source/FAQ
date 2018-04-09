import algoliasearch from 'algoliasearch'

import { apollo } from 'services'

import { getListNodesQuery } from 'scenes/Home/queries'

class Search {
  constructor () {
    this.algolia = algoliasearch(
      process.env.REACT_APP_ALGOLIA_APP_ID,
      process.env.REACT_APP_ALGOLIA_API_KEY_SEARCH,
      { protocol: 'https:' }
    )
    this.index = this.algolia.initIndex('Nodes')
  }

  simpleQuery (text) {
    return this.query({
      query: text,
      advancedSyntax: true,
      removeWordsIfNoResults: 'allOptional'
    })
  }

  query (params) {
    /* First we query Algolia, then we get the nodes from graphcool.
      Graphcool resolvers are limited to scalar types, so we can't
      write a resolver which does both
      https://github.com/graphcool/graphcool-framework/issues/256 */
    return new Promise((resolve, reject) => {
      this.index
        .search(params)
        .then(content => {
          const ids = content.hits.map(h => h.objectID)
          const highlights = content.hits.reduce((acc, hit) => {
            acc[hit.objectID] = hit._highlightResult
            return acc
          }, {})

          apollo
            .query({
              query: getListNodesQuery,
              variables: { ids }
            })
            .then(results => {
              const nodes = results.data.allZNodes
                .map(node => {
                  const clone = Object.assign({}, node)
                  clone['highlight'] = highlights[node.id]
                  return clone
                })
                .sort((a, b) => {
                  // Re-sort by algolia results
                  const ai = ids.indexOf(a.id)
                  const bi = ids.indexOf(b.id)
                  return ai > bi ? 1 : ai < bi ? -1 : 0
                })
              resolve({ nodes, params })
            })
            .catch(reject)
        })
        .catch(reject)
    })
  }
}

const stubSearch = {
  simpleQuery () {
    return this.query()
  },
  query () {
    return Promise.resolve([])
  }
}

const search = process.env.REACT_APP_ALGOLIA_APP_ID ? new Search() : stubSearch

export default search
