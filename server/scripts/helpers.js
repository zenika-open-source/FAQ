const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const { execSync } = require('child_process')

const generateToken = (payload, secret) => {
  const fullPayload = {
    ...payload,
    iat: (Date.now() / 1000) | 0,
    exp: ((Date.now() / 1000) | 0) + 10
  }

  return jwt.sign(fullPayload, secret)
}

const generateManagementToken = secret =>
  generateToken(
    {
      grants: [
        {
          target: '*/*',
          action: '*'
        }
      ]
    },
    secret
  )

const generateServiceToken = (name, stage, secret) =>
  generateToken(
    {
      data: {
        service: name + '@' + stage,
        roles: ['admin']
      }
    },
    secret
  )

const env = names => {
  const variables = {}

  names.map(name => {
    if (!process.env[name] && !name.endsWith('?')) {
      console.error(
        'The following env variables are required: ' +
          names.filter(n => !n.endsWith('?')).join(', ')
      )
      console.error('Missing var: ' + name)
      process.exit(1)
    }
    name = name.replace('?', '')
    variables[name] = process.env[name]
  })

  return variables
}

const gqlQuery = ({ url, token, gql }) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: gql
    })
  })
    .then(res => res.json())
    .then(d => d.data)

// Implicit env required: PRISMA_URL, PRISMA_API_SECRET
const queryService = (name, stage, gql) => {
  const token = generateServiceToken(name, stage, process.env.PRISMA_API_SECRET)
  return gqlQuery({
    url: process.env.PRISMA_URL + '/' + name + '/' + stage,
    token,
    gql
  })
}

// Implicit env required: PRISMA_URL, PRISMA_MANAGEMENT_API_SECRET
const queryManagement = gql => {
  const token = generateManagementToken(process.env.PRISMA_MANAGEMENT_API_SECRET)
  return gqlQuery({
    url: process.env.PRISMA_URL + '/management',
    token,
    gql
  })
}

// Implicit env required: PRISMA_URL, PRISMA_API_SECRET
const deployPrismaService = (name, stage) => {
  const isForcing = process.argv.includes('--force')
  run('npx prisma deploy ' + (isForcing ? '--force' : ''), {
    PRISMA_URL: process.env.PRISMA_URL + '/' + name + '/' + stage
  })
}

// Implicit env required: PRISMA_URL, PRISMA_API_SECRET
const deployAlgoliaIndex = async (name, stage) => {
  run('node ../algolia_settings/index.js', {
    SERVICE_NAME: name,
    SERVICE_STAGE: stage
  })
}

const fromArgs = () => [...process.argv.slice(2), 'default', 'default']

const run = (command, env) =>
  execSync(command, {
    env: {
      ...process.env,
      ...env
    },
    stdio: 'inherit'
  })

module.exports = {
  env,
  run,
  queryService,
  queryManagement,
  deployPrismaService,
  deployAlgoliaIndex,
  fromArgs
}
