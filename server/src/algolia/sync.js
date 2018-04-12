const algoliasearch = require('algoliasearch')

export default async event => {
  if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_API_KEY_ALL) {
    return { error: 'Algolia is absent from the environment variables' }
  }

  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY_ALL
  )

  const index = client.initIndex('Nodes')

  const modelName = Object.keys(event.data)[0]

  const { mutation, node, previousValues } = event.data[modelName]

  if (mutation === 'CREATED' && modelName === 'Question') {
    return index.addObject(node.node)
  } else if (mutation === 'DELETED' && modelName === 'ZNode') {
    return index.deleteObject(previousValues.id)
  } else {
    return index.saveObject(node.node)
  }

  // Current limitation:
  // When mutation == DELETED on Question or Answer, there is currently no way
  // to retrieve the associated ZNode. So we can't update it on algolia.
  // We currently don't offer the possibility to delete a Question or Answer
  // in the UI, so this is a problem for another day.
  // Solutions:
  // - Graphcool will probably update its api to allow subscriptions on relations
  // - When deleting Questions and Answers, change a dummy attribute on ZNode
  //   to trigger UPDATED
}
