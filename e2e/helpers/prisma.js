const path = require('path')
const execSync = require('child_process').execSync
require('../../server/scripts/algolia_settings/index')

const createUser = /* GraphQL */ `
  mutation CreateUser {
    createUser(
      data: { key: "playwrightTest", name: "playwrightTest", email: "faq-user-no-auth@zenika.com" }
    ) {
      id
    }
  }
`

export const createUserMutation = async apiContext => {
  const res = await apiContext.post('/', {
    data: {
      query: createUser
    }
  })
  const results = await res.json()
  return results.data.createUser.id
}

const createTempUser = tagId => {
  return {
    data: {
      key: 'tempUser',
      name: 'tempUser',
      email: 'temp-user@zenika.com',
      picture:
        'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      specialties: {
        connect: {
          id: tagId
        }
      }
    }
  }
}

export const createTempUserMutation = async (prisma, tagId) => {
  const user = await prisma.mutation.createUser(createTempUser(tagId))
  return user.id
}

const upsertConfig = /* GraphQL */ `mutation UpsertConfig{
  upsertConfiguration(
    where: {name: "default"}
    create: {
      name: "${process.env.SERVICE_NAME}"
      algoliaAppId: "${process.env.ALGOLIA_APP_ID}"
      algoliaApiKey: "${process.env.ALGOLIA_API_KEY_ALL}"
      auth0Domain: "${process.env.AUTH0_DOMAIN}"
      auth0ClientId: "${process.env.AUTH0_CLIENT_ID}"
      tagCategories: {
        create: [
          {
            name: "services",
            order: 1,
            labels: {
              create: [
                {name: "payroll", order: 1}
                {name: "marketing", order: 2}
                {name: "ce", order: 3}
                {name: "sales", order: 4}
              ]
            }
          },
          {
            name: "agencies",
            order: 2,
            labels: {
              create: [
                { name: "paris", order: 1 }
                { name: "nantes", order: 2 }
              ]
            }
          },
          {
            name: "theme",
            order: 3,
            labels: {
              create: [
                { name: "tutorial", order: 1 },
                { name: "meta", order: 2 }
              ]
            }
          }
        ]
      }
    }
    update: {
      name: "${process.env.SERVICE_NAME}"
      algoliaAppId: "${process.env.ALGOLIA_APP_ID}"
      algoliaApiKey: "${process.env.ALGOLIA_API_KEY_ALL}"
      auth0Domain: "${process.env.AUTH0_DOMAIN}"
      auth0ClientId: "${process.env.AUTH0_CLIENT_ID}"
    }
  ) {
    id
    name
    title
    auth0Domain
    auth0ClientId
    authorizedDomains
    algoliaAppId
    algoliaApiKey
    algoliaSynonyms
    mailgunDomain
    mailgunApiKey
    slackChannelHook
    tagCategories {
      order
      name
      labels {
        id
        order
        name
      }
    }
    workplaceSharing
    bugReporting
  }
}`

export const upsertConfigMutation = async apiContext => {
  const res = await apiContext.post('/', {
    data: {
      query: upsertConfig
    }
  })
  const results = await res.json()
  return results.data
}

const tagsId = /* GraphQL */ `
  query GetAllTags {
    tagLabels {
      id
      name
    }
  }
`

export const tagsQuery = async apiContext => {
  const res = await apiContext.post('/', {
    data: {
      query: tagsId
    }
  })
  const jsonRes = await res.json()
  const results = await jsonRes.data.tagLabels
  const tag = results[0]
  const tagEdit = results[1]
  return { tag, tagEdit }
}

const createZNodeParams = (tagId, userId) => {
  return {
    data: {
      question: {
        create: {
          title: 'Ceci est une question',
          language: 'fr',
          slug: 'slug.Ceci est une question',
          translation: {
            create: {
              language: 'en',
              text: 'This is a question'
            }
          },
          user: {
            connect: {
              id: userId
            }
          }
        }
      },
      answer: {
        create: {
          content: 'Ceci est une réponse',
          language: 'fr',
          translation: {
            create: {
              language: 'en',
              text: 'This is an answer'
            }
          },
          user: {
            connect: {
              id: userId
            }
          }
        }
      },
      tags: {
        create: {
          label: {
            connect: {
              id: tagId
            }
          },
          user: {
            connect: {
              id: userId
            }
          }
        }
      }
    }
  }
}

const createZNodeWithoutAnswerParams = (tagId, userId) => {
  return {
    data: {
      question: {
        create: {
          title: 'Ceci est une question',
          language: 'fr',
          slug: 'slug.Ceci est une question',
          translation: {
            create: {
              language: 'en',
              text: 'This is a question'
            }
          },
          user: {
            connect: {
              id: userId
            }
          }
        }
      },
      tags: {
        create: {
          label: {
            connect: {
              id: tagId
            }
          },
          user: {
            connect: {
              id: userId
            }
          }
        }
      }
    }
  }
}

const createZNodeWithoutTranslation = (tagId, userId) => {
  return {
    data: {
      question: {
        create: {
          title: 'Ceci est une question',
          language: 'fr',
          slug: 'slug.Ceci est une question',
          translation: {},
          user: {
            connect: {
              id: userId
            }
          }
        }
      },
      answer: {
        create: {
          content: 'Ceci est une réponse',
          language: 'fr',
          translation: {},
          user: {
            connect: {
              id: userId
            }
          }
        }
      },
      tags: {
        create: {
          label: {
            connect: {
              id: tagId
            }
          },
          user: {
            connect: {
              id: userId
            }
          }
        }
      }
    }
  }
}

const createTempZnode = (tagId, userId) => {
  return {
    data: {
      question: {
        create: {
          title: 'Ceci est une question',
          language: 'fr',
          slug: 'slug.Ceci est une question',
          translation: {
            create: {
              language: 'en',
              text: 'This is a question'
            }
          },
          user: {
            connect: {
              id: userId
            }
          }
        }
      },
      answer: {
        create: {
          content: 'Ceci est une réponse',
          language: 'fr',
          translation: {
            create: {
              language: 'en',
              text: 'This is an answer'
            }
          },
          user: {
            connect: {
              id: userId
            }
          }
        }
      },
      tags: {
        create: {
          label: {
            connect: {
              id: tagId
            }
          },
          user: {
            connect: {
              id: userId
            }
          }
        }
      },
      flags: {
        create: {
          type: 'certified',
          user: {
            connect: {
              id: userId
            }
          }
        }
      }
    }
  }
}

export const createQuestion = async (prisma, tagId, user) => {
  const zNode = await prisma.mutation.createZNode(createZNodeWithoutAnswerParams(tagId, user))
  await algolia.addNode({ prisma }, zNode.id)
}

export const createQuestionAndAnswer = async (prisma, tagId, user) => {
  const zNode = await prisma.mutation.createZNode(createZNodeParams(tagId, user))
  await algolia.addNode({ prisma }, zNode.id)
}

export const createQuestionWithFlag = async (prisma, tagId, user) => {
  const zNode = await prisma.mutation.createZNode(createTempZnode(tagId, user))
  await algolia.addNode({ prisma }, zNode.id)
}

export const createQuestionAndAnswerWithoutTranslation = async (prisma, tagId, user) => {
  const zNode = await prisma.mutation.createZNode(createZNodeWithoutTranslation(tagId, user))
  await algolia.addNode({ prisma }, zNode.id)
}

export let token

export const fetchPrismaToken = () => {
  const PATH = path.resolve(process.cwd(), '..')
  token = execSync('npm run --silent token default/default', {
    cwd: `${PATH}/server`
  })
    .toString()
    .trim()
}
