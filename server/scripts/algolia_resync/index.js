const fs = require('fs')

const algoliasearch = require('algoliasearch')

const { ALGOLIA_APP_ID, ALGOLIA_API_KEY_ADMIN, ALGOLIA_INDEX } = process.env

if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY_ADMIN || !ALGOLIA_INDEX) {
  console.error('Algolia is absent from the environment variables')
  return
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY_ADMIN)

const index = client.initIndex(ALGOLIA_INDEX)

const readJson = path =>
  new Promise((resolve, reject) =>
    fs.readFile(require.resolve(path), (err, data) => {
      if (err) reject(err)
      resolve(JSON.parse(data))
    })
  )

const writeJson = path => data =>
  new Promise((resolve, reject) =>
    fs.writeFile(require.resolve(path), JSON.stringify(data), err => {
      if (err) reject(err)
      resolve()
    })
  )

const readAllFiles = () => {
  const files = [
    readJson('./data/lists/000001.json'),
    readJson('./data/nodes/000001.json'),
    readJson('./data/relations/000001.json')
  ]

  return Promise.all(files)
}

const findNodes = (type, data) =>
  data.values.filter(n => n._typeName === type).reduce((acc, n) => {
    acc[n.id] = n
    return acc
  }, {})

const findRelations = relations => (zNodeId, type, nodes) =>
  relations.values.reduce((acc, relation) => {
    if (
      relation[0]._typeName === 'ZNode' &&
      relation[0].id === zNodeId &&
      relation[1]._typeName === type
    ) {
      acc.push(nodes[relation[1].id])
    }
    return acc
  }, [])

const reconstructData = async () => {
  const [lists, nodes, relations] = await readAllFiles()

  const findRel = findRelations(relations)

  const zNodes = Object.values(findNodes('ZNode', nodes))
  const questions = findNodes('Question', nodes)
  const answers = findNodes('Answer', nodes)
  const tags = findNodes('Tag', nodes)
  const flags = findNodes('Flag', nodes)

  const entries = zNodes.map(n => {
    const question = findRel(n.id, 'Question', questions)[0]
    const answer = findRel(n.id, 'Answer', answers)[0]
    const tag = findRel(n.id, 'Tag', tags)
    const flag = findRel(n.id, 'Flag', flags)

    return {
      objectID: n.id,
      question: {
        title: question.title,
        slug: question.slug
      },
      answer: answer
        ? {
            content: answer.content
          }
        : null,
      tag: tag.map(t => t.label),
      flag: flag.map(f => f.type)
    }
  })

  return entries
}

const clearIndex = () =>
  new Promise((resolve, reject) => {
    index.clearIndex((err, content) => {
      if (err) reject(err)

      resolve(content)
    })
  })

const addObjects = nodes =>
  new Promise((resolve, reject) => {
    index.addObjects(nodes, (err, content) => {
      if (err) reject(err)

      resolve(content)
    })
  })

const resyncAlgolia = async () => {
  const entries = await reconstructData()

  await clearIndex()

  await addObjects(entries)

  console.log('Resync done!')
}

resyncAlgolia()
