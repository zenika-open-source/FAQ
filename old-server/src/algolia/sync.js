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

  const { mutation, previousValues } = event.data[modelName]
  const node =
    modelName == 'ZNode'
      ? event.data.ZNode.node
      : event.data[modelName].node.node

  const functions = {
    ZNode: {
      UPDATED: () =>
        index.partialUpdateObject({
          objectID: node.id,
          question: node.question,
          answer: node.answer,
          tag: node.tags.map(tag => tag.label),
          flag: node.flags
            .map(flag => flag.type)
            .concat(node.answer ? [] : ['unanswered'])
        }),
      DELETED: () => index.deleteObject(previousValues.id)
    },
    Question: {
      CREATED: () =>
        index.addObject({
          objectID: node.id,
          question: node.question,
          tag: node.tags.map(tag => tag.label),
          flag: ['unanswered']
        })
    },
    Answer: {
      CREATED: () =>
        index.partialUpdateObject({
          objectID: node.id,
          answer: node.answer,
          flag: node.flags
            .map(flag => flag.type)
            .concat(node.answer ? [] : ['unanswered'])
        })
    },
    Flag: {
      CREATED: () =>
        index.partialUpdateObject({
          objectID: node.id,
          flag: node.flags
            .map(flag => flag.type)
            .concat(node.answer ? [] : ['unanswered'])
        })
    }
  }

  if (functions[modelName] && functions[modelName][mutation]) {
    return functions[modelName][mutation]()
  }

  return {
    error: `${modelName} ${mutation} did not trigger an indexing operation`
  }

  // Current limitation:
  // When mutation == DELETED on Question or Answer, there is currently no way
  // to retrieve the associated ZNode. So we can't update it on algolia.
  // We currently don't offer the possibility to delete a Question or Answer
  // in the UI, so this is a problem for another day.
  //
  // Solutions:
  // - Graphcool will probably update its api to allow subscriptions on relations
  // - When deleting Questions and Answers, change a dummy attribute on ZNode
  //   to trigger UPDATED
  //
  // Currently implemented solution:
  // - Changing dummy when deleting Tags and Flags (Questions and Answers
  //   NOT implemented yet)
}
