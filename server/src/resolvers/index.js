const resolvers = [
  './user',
  './question',
  './answer',
  './flag',
  './history',
  './search',
  './random'
]

const mergeResolvers = resolvers =>
  resolvers.reduce((acc, res) => {
    Object.keys(res).map(type => {
      if (!acc[type]) acc[type] = {}

      acc[type] = { ...acc[type], ...res[type] }
    })

    return acc
  }, {})

module.exports = mergeResolvers(resolvers.map(path => require(path)))
