import algoliasearch from 'algoliasearch'

class Search {
  constructor () {
    this.client = algoliasearch(
      process.env.REACT_APP_ALGOLIA_APP_ID,
      process.env.REACT_APP_ALGOLIA_API_KEY_SEARCH
    )
    this.index = this.client.initIndex('Questions')
  }

  simpleSearch (query, cb) {
    this.index.search({ query: query }, cb)
  }
}

const search = new Search()

export default search
