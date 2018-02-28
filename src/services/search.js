import algoliasearch from 'algoliasearch'
import { gql } from 'apollo-boost'

import { apollo } from 'services'

const getListNodes = gql`
  query getListNodes($ids: [ID!]!) {
    allZNodes(filter: { id_in: $ids }) {
      id
      question {
        id
        title
        user {
          id
          picture
        }
      }
      answer {
        id
        content
      }
    }
  }
`

class Search {
  constructor () {
    this.algolia = algoliasearch(
      process.env.REACT_APP_ALGOLIA_APP_ID,
      process.env.REACT_APP_ALGOLIA_API_KEY_SEARCH
    )
    this.index = this.algolia.initIndex('Nodes')
  }

  simpleQuery (text) {
    return this.query({ query: text })
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
              query: getListNodes,
              variables: { ids }
            })
            .then(results => {
              const nodes = results.data.allZNodes.map(node => {
                const clone = Object.assign({}, node)
                clone['highlight'] = highlights[node.id]
                return clone
              })

              resolve(nodes)
            })
            .catch(reject)
        })
        .catch(reject)
    })
  }
}

const search = new Search()

export default search
