const algoliasearch = require('algoliasearch')

const synonyms = require('./synonyms.json')

const client = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_API_KEY_ALL
)

const index = client.initIndex('Nodes')

index.batchSynonyms(
  synonyms,
  {
    forwardToReplicas: true,
    replaceExistingSynonyms: true
  },
  function (err, content) {
    if (err) throw err

    console.log(content)
  }
)
