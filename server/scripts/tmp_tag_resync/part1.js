const { Prisma } = require('prisma-binding')

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_URL,
  secret: process.env.PRISMA_API_SECRET
})

const main = async () => {
  const conf = await prisma.query.configuration({ where: { name: 'default' } })

  console.log(conf.tags)

  const categories = Object.entries(conf.tags)

  const tagsCategories = await Promise.all(
    categories.map(([name, tags], order) =>
      prisma.mutation.createTagCategory(
        {
          data: {
            name,
            labels: {
              create: tags.map((tag, order) => ({ name: tag, order }))
            },
            order,
            configuration: {
              connect: {
                id: conf.id
              }
            }
          }
        },
        `
        {
          id
          name
          labels {
            id
            name
          }
        }
        `
      )
    )
  )

  const tagLabels = tagsCategories.reduce((acc, cat) => acc.concat(cat.labels), [])

  const tags = await prisma.query.tags(
    null,
    `
    {
      id
      label
    }
    `
  )

  await Promise.all(
    tags.map(tag => {
      const tagLabel = tagLabels.find(label => label.name === tag.label)
      if (!tagLabel) {
        console.log(`Unknown tag "${tag.label}" on "${tag.id}"`)
        return
      }
      return prisma.mutation.updateTag({
        where: { id: tag.id },
        data: {
          // label: null, // I'll manually remove label. This is a security in case something goes wrong
          tagLabel: { connect: { id: tagLabel.id } }
        }
      })
    })
  )
}

main()
  .then(() => {
    console.log('Done!')
  })
  .catch(e => {
    console.error(e)
  })
