const algoliasearch = require('algoliasearch')
const { env } = require('../helpers')

const synonyms = require('./synonyms.json')

const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = env([
  'ALGOLIA_APP_ID',
  'ALGOLIA_API_KEY',
  'ALGOLIA_INDEX'
])

const main = () => {
  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)

  const index = client.initIndex(ALGOLIA_INDEX)

  index.batchSynonyms(
    synonyms,
    {
      forwardToReplicas: true,
      replaceExistingSynonyms: true
    },
    function(err, content) {
      if (err) throw err

      console.log(content)
    }
  )

  index.setSettings({
    attributesForFaceting: ['filterOnly(tag)', 'filterOnly(flag)'],
    removeStopWords: ['en', 'fr']
  })
}

main()
