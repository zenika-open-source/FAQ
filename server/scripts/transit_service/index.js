const { execFileSync } = require('child_process')

const getArgs = () =>
  process.argv
    .slice(2)
    .map(a => a.split('='))
    .reduce((acc, a) => {
      acc[a[0].replace('--', '')] = a[1]
      return acc
    }, {})

const exportService = url =>
  execFileSync('prisma', ['export', '--path', './data.zip'], {
    env: {
      ...process.env,
      PRISMA_URL: url
    }
  })

const unzipData = () => execFileSync('unzip', ['-d', 'data/', './data.zip'])

const importService = url =>
  execFileSync('prisma', ['import', '--data', 'data'], {
    env: {
      ...process.env,
      PRISMA_URL: url
    }
  })

const main = async () => {
  const args = getArgs()
  if (!args.from || !args.to) {
    console.error('You forgot either --from or --to. Check the doc!')
    return
  }

  exportService(args.from)
  unzipData()
  importService(args.to)
}

main()
