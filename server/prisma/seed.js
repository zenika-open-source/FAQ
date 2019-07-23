const Photon = require('@generated/photon')

const photon = new Photon()

async function main() {
  const configuration = await photon.configurations.create({
    data: {
      name: 'default',
      title: 'Dev',
      auth0Domain: process.env.AUTH0_DOMAIN,
      auth0ClientId: process.env.AUTH0_CLIENT_ID,
      algoliaAppId: process.env.ALGOLIA_APP_ID,
      algoliaApiKey: process.env.ALGOLIA_API_KEY,
      mailgunDomain: process.env.MAILGUN_DOMAIN,
      mailgunApiKey: process.env.MAILGUN_API_KEY,
      tags: `{"agencies": ["paris", "nantes"], "theme": ["tutorial", "meta"]}`
    }
  })

  // TODO: If we create a first user, then the dev will not be promoted admin the first time he logins
  // Workable solution: Create the first question on the first login to the tenant
  const user = await photon.users.create({
    data: {
      email: 'thibaud.courtoison@gmail.com',
      name: 'Thibaud Courtoison',
      picture:
        'https://lh3.googleusercontent.com/-dbxgoH-NtyE/AAAAAAAAAAI/AAAAAAAAAAc/ylO4YtIzICE/photo.jpg'
    }
  })

  const user2 = await photon.users.create({
    data: {
      email: 'the-dev@localhost',
      name: 'The Dev',
      key: 'secret-42',
      picture: '/img/portrait_placeholder.png'
    }
  })

  const node = await photon.nodes.create({
    data: {
      dummy: true
    }
  })

  const question = await photon.questions.create({
    data: {
      title: "Welcome to the FAQ! What's next?",
      slug: 'welcome-to-the-faq-whats-next',
      user: {
        connect: {
          id: user.id
        }
      },
      node: {
        connect: { id: node.id }
      }
    }
  })

  const answer = await photon.answers.create({
    data: {
      content: 'TODO',
      user: {
        connect: {
          id: user.id
        }
      },
      node: {
        connect: { id: node.id }
      }
    }
  })

  console.log('Seeding done!')
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await photon.disconnect()
  })
