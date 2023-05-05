import { expect, test } from '@playwright/test'
const path = require('path')
const multiTenant = require('../server/src/multiTenant')
const algolia = require('../server/src/integrations/algolia')
const execSync = require('child_process').execSync
require('../server/scripts/algolia_settings/index')

const createUser = /* GraphQL */ `
  mutation CreateUser {
    createUser(
      data: { key: "playwrightTest", name: "playwrightTest", email: "faq-user-no-auth@zenika.com" }
    ) {
      id
    }
  }
`

const createUserMutation = async apiContext => {
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

const createTempUserMutation = async (prisma, tagId) => {
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

const upsertConfigMutation = async apiContext => {
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

const tagsQuery = async apiContext => {
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

const deleteAll = field => {
  return /* GraphQL */ `mutation DeleteAll{
      ${field} {
        count
      }
    }`
}

const createZNodeParams = (tagId, userId) => {
  return {
    data: {
      question: {
        create: {
          title: 'Ceci est une question',
          slug: 'slug.Ceci est une question',
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
          slug: 'slug.Ceci est une question',
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
          slug: 'slug.Ceci est une question',
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

let apiContext
let prisma
let tag
let tagEdit
let token
let user
let tempUser
let config

const fetchPrismaToken = () => {
  const PATH = path.resolve(process.cwd(), '..')
  token = execSync('npm run --silent token default/default', {
    cwd: `${PATH}/server`
  })
    .toString()
    .trim()
}

const createQuestion = async (prisma, tagId, user) => {
  const zNode = await prisma.mutation.createZNode(createZNodeWithoutAnswerParams(tagId, user))
  await algolia.addNode({ prisma }, zNode.id)
}

const createQuestionAndAnswer = async (prisma, tagId, user) => {
  const zNode = await prisma.mutation.createZNode(createZNodeParams(tagId, user))
  await algolia.addNode({ prisma }, zNode.id)
}

const createQuestionWithFlag = async (prisma, tagId, user) => {
  const zNode = await prisma.mutation.createZNode(createTempZnode(tagId, user))
  await algolia.addNode({ prisma }, zNode.id)
}

test.beforeAll(async ({ playwright }) => {
  fetchPrismaToken()
  apiContext = await playwright.request.newContext({
    baseURL: 'http://localhost:4466',
    extraHTTPHeaders: {
      Authorization: token,
      'faq-tenant': 'default/default'
    }
  })
  prisma = multiTenant.current({
    headers: {
      'faq-tenant': 'default/default'
    }
  })
  config = await upsertConfigMutation(apiContext)
  prisma._meta = { ...prisma._meta, configuration: config.upsertConfiguration }
  user = await createUserMutation(apiContext)
  ;({ tag, tagEdit } = await tagsQuery(apiContext))
  tempUser = await createTempUserMutation(prisma, tag.id)
})

test.beforeEach(async () => {
  const deleteCommands = [
    'deleteManyAnswers',
    'deleteManyQuestions',
    'deleteManyHistoryActions',
    'deleteManyFlags',
    'deleteManyTags',
    'deleteManyZNodes'
  ]
  for (const command of deleteCommands) {
    await apiContext.post('/', {
      data: {
        query: deleteAll(command)
      }
    })
  }
})

test('Shoud be able to create a question', async ({ page }) => {
  await page.goto('/')
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator('input').click()
  await page.locator('input').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText(tag.name, { exact: true })
    .first()
    .click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await expect(page.getByRole('heading', { name: 'Ceci est une question' })).toBeVisible()
})

test('Should be able to create a question and answer it', async ({ page }) => {
  await page.goto('/')
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator("input:near(:text('help'))").click()
  await page.locator("input:near(:text('help'))").fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText(tag.name, { exact: true })
    .first()
    .click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await expect(page.getByRole('heading', { name: 'Ceci est une question' })).toBeVisible()
  await page.locator('button', { hasText: 'Répondre à la question' }).click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill('Ceci est une réponse')
  await page.locator('button', { hasText: 'Envoyer la réponse' }).click()
  await expect(page.getByText('Ceci est une réponse', { exact: true })).toBeVisible()
})

test('Should return a search result', async ({ page }) => {
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.locator("input:near(:text('search'))").click()
  const searchQuery = 'Ceci est une question'.slice(0, 4)
  await page.locator("input:near(:text('search'))").fill(searchQuery)
  await expect(page.getByRole('heading', { name: 'Ceci est une question' }).first()).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await expect(page.getByRole('heading', { name: 'Ceci est une question' })).toBeVisible()
})

test('Should not return results', async ({ page }) => {
  await page.goto('/')
  await page.locator("input:near(:text('search'))").click()
  await page.locator("input:near(:text('search'))").fill('test')
  await expect(page.getByText('Aucune question trouvée')).toBeVisible()
})

test('Should be able to flag a question', async ({ page }) => {
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.waitForTimeout(1000)
  await page.locator("button:near(:text('Filtrer par tags:'))").click()
  await page.locator('.category-item', { hasText: tag.name }).click()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Signaler' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'historyobsolète' })
    .click()
  await expect(page.locator('span.label', { hasText: 'Obsolète' })).toBeVisible()
})

test('Should be able to add a tag to a question', async ({ page }) => {
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.locator("input:near(:text('search'))").click()
  const searchQuery = 'Ceci est une question'.slice(0, 6)
  await page.locator("input:near(:text('search'))").fill(searchQuery)
  await expect(page.getByRole('heading', { name: 'Ceci est une question' }).first()).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'editQuestion' })
    .click()
  await page.getByRole('button', { name: 'add' }).click()
  await page.getByText(tagEdit.name, { exact: true }).click()
  await page.locator('button', { hasText: 'Enregistrer la question' }).click()
  await expect(page.getByText(tag.name, tagEdit.name)).toBeVisible()
})

test('Should be able to modify an answer for an already answered question', async ({ page }) => {
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.locator("input:near(:text('search'))").click()
  await page.locator("input:near(:text('search'))").fill('Ceci est une question')
  await expect(page.getByRole('heading', { name: 'Ceci est une question' }).first()).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Réponse' })
    .click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill('Ceci est une réponse différente')
  await page.locator('button', { hasText: 'Enregistrer la réponse' }).click()
  await expect(page.getByText('Ceci est une réponse différente', { exact: true })).toBeVisible()
})

test('Should be able to answer a question that has no answer', async ({ page }) => {
  await createQuestion(prisma, tag.id, user)
  await page.goto('/')
  await expect(page.getByText('Pas encore de réponse...')).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.locator('button', { hasText: 'Répondre à la question' }).click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill('Ceci est une réponse')
  await page.locator('button', { hasText: 'Envoyer la réponse' }).click()
  await expect(page.getByText('Ceci est une réponse', { exact: true })).toBeVisible()
})

test('Should be able to search by text and tag', async ({ page }) => {
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.waitForTimeout(1000)
  await page.locator("input:near(:text('search'))").click()
  await page.locator("input:near(:text('search'))").fill('Ceci est une question')
  await expect(page.getByRole('heading', { name: 'Ceci est une question' }).first()).toBeVisible()
  await page.locator("button:near(:text('Filtrer par tags:'))").click()
  await page.locator('.category-item', { hasText: tag.name }).click()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Réponse' })
    .click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill('Ceci est une réponse différente')
  await page.locator('button', { hasText: 'Enregistrer la réponse' }).click()
  await expect(page.getByText('Ceci est une réponse différente', { exact: true })).toBeVisible()
})

test('Should see the marketing specialty on profile page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('img', { name: 'avatar' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Profil' })
    .click()
  await expect(page.getByText('verifiedmarketing')).toBeVisible()
})

test('Should not be able to add a certified flag to an unanswered question', async ({ page }) => {
  await page.goto('/')
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator('input').click()
  await page.locator('input').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText('marketing', { exact: true })
    .first()
    .click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await page.getByRole('button', { name: 'flag Signaler ...' }).hover()
  await expect(page.locator('a').filter({ hasText: 'verifiedcertifiée' })).toBeHidden()
})

test('Should be able to add a certified flag for a question of my specialty', async ({ page }) => {
  await page.goto('/')
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator('input').click()
  await page.locator('input').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText('marketing', { exact: true })
    .first()
    .click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await page.locator('button', { hasText: 'Répondre à la question' }).click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill('Ceci est une réponse')
  await page.locator('button', { hasText: 'Envoyer la réponse' }).click()
  await page.getByRole('button', { name: 'flag Signaler ...' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'verifiedcertifiée' })
    .click()
  await page.waitForTimeout(1000)
  await page.goto('/')
  await expect(page.getByText('verified')).toBeVisible()
})

test('Should not be able to add a certified flag for a question not in my specialty', async ({
  page
}) => {
  await page.goto('/')
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator('input').click()
  await page.locator('input').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText('ce', { exact: true })
    .first()
    .click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await page.locator('button', { hasText: 'Répondre à la question' }).click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill('Ceci est une réponse')
  await page.locator('button', { hasText: 'Envoyer la réponse' }).click()
  await page.getByRole('button', { name: 'flag Signaler ...' }).hover()
  await expect(page.locator('a').filter({ hasText: 'verifiedcertifiée' })).toBeHidden()
})

test('Should remove the certified flag after modifying an answer', async ({ page }) => {
  await createQuestionWithFlag(prisma, tag.id, tempUser)
  await page.goto('/')
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await expect(page.getByText('verifiedCertifiée')).toBeVisible()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Réponse' })
    .click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill('Ceci est une réponse différente')
  await page.locator('button', { hasText: 'Enregistrer la réponse' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('verifiedCertifiée')).toBeHidden()
})

test.afterEach(async () => {
  algolia.clearIndex({ prisma })
})

test.afterAll(async () => {
  await apiContext.dispose()
})
