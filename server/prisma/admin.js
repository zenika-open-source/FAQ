const Photon = require('@generated/photon')

const photon = new Photon()

async function main() {
  await photon.users.updateMany({
    data: {
      admin: true
    }
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await photon.disconnect()
  })
