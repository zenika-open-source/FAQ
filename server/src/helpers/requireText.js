const fs = require('fs')

module.exports = (name, require, variables = {}) => {
  const txt = fs.readFileSync(require.resolve(name), 'utf8').toString()
  return txt.replace(/\${\n?(\w*)\n?}/gm, (_, name) => variables[name])
}
