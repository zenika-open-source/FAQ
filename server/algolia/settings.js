const algoliasearch = require('algoliasearch')

const synonyms = require('./synonyms.json')

const { ALGOLIA_APP_ID, ALGOLIA_API_KEY_ALL, ALGOLIA_INDEX } = process.env

if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY_ALL || !ALGOLIA_INDEX) {
  console.error('Algolia is absent from the environment variables')
  return
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY_ALL)

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
