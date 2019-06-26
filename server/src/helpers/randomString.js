const randomString = length => {
  let str = ''
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = length; i > 0; i--) str += chars[Math.floor(Math.random() * chars.length)]
  return str
}

module.exports = randomString
