const { env, queryManagement } = require('../helpers')

env([
  'PRISMA_URL', // Implicitely required
  'PRISMA_API_SECRET', // Implicitely required
  'PRISMA_MANAGEMENT_API_SECRET' // Implicitely required
])

const { Prisma } = require('prisma-binding')

const resync = async (name, stage) => {
  const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_URL + '/' + name + '/' + stage,
    secret: process.env.PRISMA_API_SECRET
  })

  const conf = await prisma.query.configuration({ where: { name: 'default' } })

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

  const subjects = tagsCategories.reduce((acc, cat) => acc.concat(cat.labels), [])

  const tags = await prisma.query.tags(
    null,
    `
    {
      id
      label
    }
    `
  )

  return Promise.all(
    tags.map(tag => {
      const subject = subjects.find(label => label.name === tag.label)
      if (!subject) {
        console.log(`Unknown tag "${tag.label}" on "${tag.id}"`)
        return
      }
      return prisma.mutation.updateTag({
        where: { id: tag.id },
        data: {
          // label: null, // I'll manually remove label. This is a security in case something goes wrong
          subject: { connect: { id: subject.id } }
        }
      })
    })
  )
}

const getServices = () =>
  queryManagement(`
    {
      listProjects {
        name
        stage
      }
    }
  `).then(d => d.listProjects)

const main = async () => {
  const services = await getServices()

  return Promise.all(services.map(({ name, stage }) => resync(name, stage)))
}

main()
  .then(() => {
    console.log('Done!')
  })
  .catch(e => {
    console.error(e)
  })
