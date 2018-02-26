const algoliasearch = require('algoliasearch')

export default async event => {
  const modelName = Object.keys(event.data)[0]

  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
  )
  const index = client.initIndex(modelName + 's')

  const { mutation, node, previousValues } = event.data[modelName]

  switch (mutation) {
    case 'CREATED':
      return index.addObject(node)
    case 'UPDATED':
      return index.saveObject(node)
    case 'DELETED':
      return index.deleteObject(previousValues.objectID)
    default:
      return { error: `Mutation was ${mutation}. Unable to sync node.` }
  }
}
