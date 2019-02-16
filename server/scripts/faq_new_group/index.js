const slugify = require('slugify')
const { env, queryService, fromArgs, deployAlgoliaIndex } = require('../helpers')

env([
  'PRISMA_URL', // Implicitely required
  'PRISMA_API_SECRET' // Implicitely required
])

const createGroup = (serviceName, serviceStage, groupName, groupSlug) =>
  queryService(
    serviceName,
    serviceStage,
    `
      mutation {
        createGroup(
          data: {
            name: "${groupName}"
            slug: "${groupSlug}"
          }
        ) {
          id
        }
      }
    `
  )

const main = async () => {
  const [serviceName, serviceStage, groupName] = fromArgs()

  const groupSlug = slugify(groupName)

  await createGroup(serviceName, serviceStage, groupName, groupSlug)

  await deployAlgoliaIndex(serviceName, serviceStage, groupSlug)

  console.log(`Successfully deployed a new group (${groupName} in ${serviceName}/${serviceStage})`)
}

main()
