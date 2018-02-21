const stringConversion = function (value) {
  if (value === 'TRUE') {
    return true
  } else if (value === 'FALSE') {
    return false
  } else if (Number.isNaN(Number.parseInt(value, 10))) {
    return Number.parseInt(value, 10)
  }
  return value
}

const Flags = {
  get: function (obj, prop) {
    const PREFIX = 'REACT_APP_FLAG_'

    prop = prop.toUpperCase()

    const names = Object.keys(process.env).filter(name =>
      name.startsWith(PREFIX + prop)
    )

    // If flag not found, default to false
    if (names.length === 0) return false

    if (names.length === 1 && names[0] === PREFIX + prop) {
      return stringConversion(process.env[names[0]])
    }

    let vars = {}
    for (let name of names) {
      let parts = name
        .replace(PREFIX, '')
        .split('_')
        .map(n => n.toLowerCase())

      let o = vars
      for (let i = 1; i < parts.length - 1; i++) {
        let part = parts[i]
        if (o[part] === undefined) {
          o[part] = {}
        }
        o = o[part]
      }

      o[parts.pop()] = stringConversion(process.env[name])
    }
    return vars
  }
}

const flags = new Proxy({}, Flags)

export default flags
