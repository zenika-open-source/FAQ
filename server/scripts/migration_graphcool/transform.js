const fs = require('fs')

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

const transformers = {
  lists: data => ({
    valueType: 'lists',
    values: data.out.jsonElements
  }),
  nodes: data => {
    let values = data.out.jsonElements

    values = values.map(n => {
      switch (n._typeName) {
        case 'ZNode': {
          // Remove "dummy" attributes from ZNodes
          let { dummy, ...rest } = n
          return rest
        }
        case 'User': {
          // Change "auth0UserId" to "auth0Id" in Users
          let { auth0UserId, ...rest } = n
          return { ...rest, auth0Id: auth0UserId.split('|')[1] }
        }
      }
      return n
    })

    return {
      valueType: 'nodes',
      values
    }
  },
  relations: data => ({
    valueType: 'relations',
    values: data.out.jsonElements
  })
}

const transformAll = async () => {
  const types = ['lists', 'nodes', 'relations']
  const transformed = types.map(type =>
    readJson(`./export.${type}.json`)
      .then(transformers[type])
      .then(writeJson(`./export.${type}.json`))
  )
  await Promise.all(transformed)
  console.log('Transformation complete!')
}

transformAll()
