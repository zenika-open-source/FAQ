const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const util = require('util')
const { execFileSync } = require('child_process')

const {
  PRISMA_URL,
  PRISMA_API_SECRET,
  PRISMA_MANAGEMENT_API_SECRET
} = process.env

if (!PRISMA_URL || !PRISMA_API_SECRET || !PRISMA_MANAGEMENT_API_SECRET) {
  console.error(
    'PRISMA_URL, PRISMA_API_SECRET and PRISMA_MANAGEMENT_API_SECRET are required'
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

const deployService = async (name, stage) =>
  execFileSync('prisma', ['deploy'], {
    env: {
      ...process.env,
      PRISMA_URL: PRISMA_URL + '/' + name + '/' + stage
    }
  })

const main = async () => {
  const services = await getServices()
  services.map(({ name, stage }) => deployService(name, stage))
}

main()
