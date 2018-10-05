const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const { execFileSync } = require('child_process')

const {
  PRISMA_URL,
  PRISMA_MANAGEMENT_API_SECRET,
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY_ALL
} = process.env

if (
  !PRISMA_URL ||
  !PRISMA_MANAGEMENT_API_SECRET ||
  !ALGOLIA_APP_ID ||
  !ALGOLIA_API_KEY_ALL
) {
  console.error(
    'PRISMA_URL, PRISMA_MANAGEMENT_API_SECRET, ALGOLIA_APP_ID and ALGOLIA_API_KEY_ALL are required'
  )
  return
}

const getServices = async () => {
  const jwtPayload = {
    grants: [
      {
        target: '*/*',
        action: '*'
      }
    ],
    iat: (Date.now() / 1000) | 0,
    exp: ((Date.now() / 1000) | 0) + 10
  }
  const token = jwt.sign(jwtPayload, PRISMA_MANAGEMENT_API_SECRET)

  const data = await fetch(PRISMA_URL + '/management', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
      {
        listProjects {
          name
          stage
        }
      }
    `
    })
  }).then(res => res.json())

  return data.data.listProjects
}

const deployPrismaService = (name, stage) =>
  execFileSync('prisma', ['deploy'], {
    env: {
      ...process.env,
      PRISMA_URL: PRISMA_URL + '/' + name + '/' + stage
    }
  })

const deployAlgoliaIndex = (name, stage) =>
  execFileSync('node', ['../../algolia/settings.js'], {
    env: {
      ...process.env,
      ALGOLIA_INDEX: name + '_' + stage
    }
  })

const main = async () => {
  const services = await getServices()
  services.map(({ name, stage }) => {
    deployPrismaService(name, stage)
    deployAlgoliaIndex(name, stage)
  })
}

main()
