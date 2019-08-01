const { execSync } = require('child_process')
const { Management } = require('prisma-multi-tenant')

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

const deployAlgoliaIndex = name =>
  run('node ./scripts/algolia_settings/index.js', {
    TENANT_NAME: name
  })

const run = (command, env) =>
  execSync(command, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...env
    },
    stdio: 'inherit'
  })

const getTenants = async () => {
  const management = new Management()
  await management.connect()
  const tenants = await management.getAll()
  await management.disconnect()
  return tenants
}

module.exports = {
  env,
  run,
  deployAlgoliaIndex,
  getTenants
}
