import { expect, test } from '@playwright/test'
const path = require('path')
const multiTenant = require('../server/src/multiTenant')
const algolia = require('../server/src/integrations/algolia')
const execSync = require('child_process').execSync
require('../server/scripts/algolia_settings/index')

const createUser = /* GraphQL */ `
  mutation CreateUser($tagEditId: ID!) {
    createUser(
      data: {
        key: "playwrightTest"
        name: "playwrightTest"
        email: "faq-user-no-auth@zenika.com"
        picture: "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"
        specialties: { connect: { id: $tagEditId } }
      }
    ) {
      id
    }
  }
`

const createUserMutation = async (apiContext, tagEditId) => {
  const res = await apiContext.post('/', {
    data: {
      query: createUser,
      variables: {
        tagEditId
      }
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
          language: 'fr',
          slug: 'ceci-est-une-question',
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
          slug: 'ceci-est-une-question',
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
          language: '',
          slug: 'ceci-est-une-question',
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
          language: '',
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
          slug: 'ceci-est-une-question',
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

const createQuestionAndAnswerWithoutTranslation = async (prisma, tagId, user) => {
  const zNode = await prisma.mutation.createZNode(createZNodeWithoutTranslation(tagId, user))
  await algolia.addNode({ prisma }, zNode.id)
}

async function setUser(page, { admin = false, specialties = [], ...rest } = {}) {
  await page.addInitScript(
    user => {
      window.localStorage.setItem('user', JSON.stringify({ name: 'Test', ...user }))
      window.localStorage.setItem(
        'session',
        JSON.stringify({ expiresAt: new Date().getTime() + 3600 * 1000, expiresIn: 3600 })
      )
    },
    { admin, specialties, ...rest }
  )
}

const deleteCommands = [
  'deleteManyAnswers',
  'deleteManyQuestions',
  'deleteManyHistoryActions',
  'deleteManyFlags',
  'deleteManyTags',
  'deleteManyZNodes',
  'deleteManyUsers'
]

const emptyDb = async (apiContext, commands) => {
  for (const command of commands) {
    await apiContext.post('/', {
      data: {
        query: deleteAll(command)
      }
    })
  }
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
    ; ({ tag, tagEdit } = await tagsQuery(apiContext))
})

test.beforeEach(async () => {
  await emptyDb(apiContext, deleteCommands)
  user = await createUserMutation(apiContext, tagEdit.id)
  tempUser = await createTempUserMutation(prisma, tag.id)
})

test('Shoud be able to create a question', async ({ page }) => {
  await setUser(page, { id: user })
  await page.goto('/')
  await page.getByRole('button', { name: "Nouvelle question" }).first().click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText(tag.name, { exact: true })
    .first()
    .click()
  await page.getByRole('button', { name: 'Envoyer la question' }).click()
  await expect(page.getByRole('heading', { name: 'Ceci est une question' })).toBeVisible()
})

test('Should be able to create a question and answer it', async ({ page }) => {
  await setUser(page, { id: user })
  await page.goto('/')
  await page.getByRole('button', { name: "Nouvelle question" }).first().click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText(tag.name, { exact: true })
    .first()
    .click()
  await page.getByRole('button', { name: 'Envoyer la question' }).click()
  await expect(page.getByRole('heading', { name: 'Ceci est une question' })).toBeVisible()
  await page.getByRole('button', { name: 'Répondre à la question' }).click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une réponse')
  await page.getByRole('button', { name: 'Envoyer la réponse' }).click()
  await expect(page.getByText('Ceci est une réponse', { exact: true })).toBeVisible()
})

test('Should return a search result', async ({ page }) => {
  await setUser(page, { id: user })
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une question')
  await expect(page.getByRole('heading', { name: 'Ceci est une question' }).first()).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await expect(page.getByRole('heading', { name: 'Ceci est une question' })).toBeVisible()
})

test('Should not return results', async ({ page }) => {
  await setUser(page, { id: user })
  await page.goto('/')
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('test')
  await expect(page.getByText('Aucune question trouvée')).toBeVisible()
})

test('Should be able to flag a question', async ({ page }) => {
  await setUser(page, { id: user })
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.waitForTimeout(2000)
  await page.getByRole('button', { name: "local_offer" }).click()
  await page.getByText(tag.name, { exact: true }).first().click()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Signaler' }).hover()
  await page.getByText('historyobsolète', { exact: true }).click()
  await expect(page.getByText('historyObsolète', { exact: true })).toBeVisible()
})

test('Should be able to add a tag to a question', async ({ page }) => {
  await setUser(page, { id: user })
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une question')
  await expect(page.getByRole('heading', { name: 'Ceci est une question' }).first()).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page.getByText('editQuestion', { exact: true }).click()
  await page.getByRole('button', { name: 'add' }).click()
  await page.getByText(tagEdit.name, { exact: true }).click()
  await page.getByRole('button', { name: 'Enregistrer la question' }).click()
  await expect(page.getByText(tag.name, tagEdit.name)).toBeVisible()
})

test('Should be able to modify an answer for an already answered question', async ({ page }) => {
  await setUser(page, { id: user })
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une question')
  await expect(page.getByRole('heading', { name: 'Ceci est une question' }).first()).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page.getByText('question_answerRéponse', { exact: true }).click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une réponse différente')
  await page.getByRole('button', { name: 'Enregistrer la réponse' }).click()
  await expect(page.getByText('Ceci est une réponse différente', { exact: true })).toBeVisible()
})

test('Should be able to answer a question that has no answer', async ({ page }) => {
  await setUser(page, { id: user })
  await createQuestion(prisma, tag.id, user)
  await page.goto('/')
  await expect(page.getByText('Pas encore de réponse...', { exact: true })).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Répondre à la question' }).click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une réponse')
  await page.getByRole('button', { name: 'Envoyer la réponse' }).click()
  await expect(page.getByText('Ceci est une réponse', { exact: true })).toBeVisible()
})

test('Should be able to search by text and tag', async ({ page }) => {
  await setUser(page, { id: user })
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.waitForTimeout(1000)
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une question')
  await expect(page.getByRole('heading', { name: 'Ceci est une question' }).first()).toBeVisible()
  await page.getByRole('button', { name: "local_offer" }).click()
  await page.getByText(tag.name, { exact: true }).first().click()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page.getByText('question_answerRéponse', { exact: true }).click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une réponse différente')
  await page.getByRole('button', { name: 'Enregistrer la réponse' }).click()
  await expect(page.getByText('Ceci est une réponse différente', { exact: true })).toBeVisible()
})

test('Should see the "marketing" specialty on a profile page', async ({ page }) => {
  await setUser(page, { id: user })
  await page.goto('/')
  await page.getByRole('img', { name: 'avatar' }).hover()
  await page.getByRole('link', { name: "Profil" }).click()
  await expect(page.getByText('verifiedmarketing')).toBeVisible()
})

test('Should not be able to add a certified flag to an unanswered question', async ({ page }) => {
  await setUser(page, { id: user })
  await page.goto('/')
  await page
    .getByRole('button', { name: 'Nouvelle question' })
    .first()
    .click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText('marketing', { exact: true })
    .first()
    .click()
  await page.getByRole('button', { name: 'Envoyer la question' }).click()
  await page.getByRole('button', { name: 'flag Signaler ...' }).hover()
  await expect(page.getByText('verifiedcertifiée', { exact: true })).toBeHidden()
})

test('Should be able to add a certified flag to a question of my specialty', async ({ page }) => {
  await setUser(page, { id: user })
  await page.goto('/')
  await page
    .getByRole('button', { name: 'Nouvelle question' })
    .first()
    .click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText('marketing', { exact: true })
    .first()
    .click()
  await page.getByRole('button', { name: 'Envoyer la question' }).click()
  await page.getByRole('button', { name: 'Répondre à la question' }).click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une réponse')
  await page.getByRole('button', { name: 'Envoyer la réponse' }).click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page.getByText('question_answerRéponse', { exact: true }).click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une réponse différente')
  await page.getByRole('button', { name: 'Enregistrer la réponse' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('Ceci est une réponse différente', { exact: true })).toBeVisible()
  await expect(page.getByText('Réponse certifiée', { exact: true })).toBeHidden()
  await expect(page.getByText('verified', { exact: true }).nth(1)).toBeVisible()
})

test('Should not be able to add a certified flag to a question not in my specialty', async ({
  page
}) => {
  await setUser(page, { id: user })
  await page.goto('/')
  await page
    .getByRole('button', { name: 'Nouvelle question' })
    .first()
    .click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText('ce', { exact: true })
    .first()
    .click()
  await page.getByRole('button', { name: 'Envoyer la question' }).click()
  await page.getByRole('button', { name: 'Répondre à la question' }).click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une réponse')
  await page.getByRole('button', { name: 'Envoyer la réponse' }).click()
  await page.getByRole('button', { name: 'flag Signaler ...' }).hover()
  await expect(page.getByText('verifiedcertifiée', { exact: true })).toBeHidden()
})

test('Should remove the certified flag after modifying an answer', async ({ page }) => {
  await setUser(page, { id: user })
  await createQuestionWithFlag(prisma, tag.id, tempUser)
  await page.goto('/')
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await expect(page.getByText('verifiedCertifiée le ', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  page.on('dialog', dialog => dialog.accept())
  await page.getByText('question_answerRéponse', { exact: true }).click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une réponse différente')
  await page.getByRole('button', { name: 'Enregistrer la réponse' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('Ceci est une réponse', { exact: true })).toBeVisible()
  await expect(page.getByText('verifiedCertifiée le')).toBeHidden()
})

test('Should remove the certified flag when the corresponding tag is deleted', async ({ page }) => {
  await setUser(page, { id: user })
  await createQuestionWithFlag(prisma, tag.id, tempUser)
  await page.goto('/')
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await expect(page.getByText('verifiedCertifiée le ', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page.getByText('editQuestion', { exact: true }).click()
  const payrollTag = page.getByText('payrollclose')
  await payrollTag.getByText('close').click()
  await page.getByRole('button', { name: 'Enregistrer la question' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('verifiedCertifiée le ', { exact: false })).toBeHidden()
})

test('Should be able to add a specialty to a user', async ({ page }) => {
  await setUser(page, { admin: true, id: user })
  await page.goto('/')
  await page.getByRole('img', { name: 'avatar' }).hover()
  await page.getByRole('link', { name: "Paramètres" }).click()
  await page.getByText('Spécialistes', { exact: true }).click()
  const userLocator = page.locator('.userElement', { hasText: 'tempUser' }).first()
  const userSpecialty = userLocator.locator('.userSpecialties').locator('.userSpecialty')
  await expect(userSpecialty.first().locator('span')).toHaveText('payroll')
  const addSpecialty = userLocator.locator('.userRight').getByRole('button', { hasText: 'add' })
  await addSpecialty.click()
  await userLocator.getByRole('button', { name: 'ce' }).click()
  await page
    .getByText('La spécialité a été ajoutée', { exact: true })
    .waitFor({ state: 'visible' })
  await page.reload()
  await page.waitForTimeout(1000)
  await page.getByText('Spécialistes', { exact: true }).click()
  await expect(userSpecialty.last().getByText('ce', { exact: true })).toBeVisible()
})

test("Should be able to remove a user's specialty", async ({ page }) => {
  await setUser(page, { admin: true, id: user })
  await page.goto('/')
  await page.getByRole('img', { name: 'avatar' }).hover()
  await page.getByRole('link', { name: "Paramètres" }).click()
  await page.getByText('Spécialistes', { exact: true }).click()
  const userLocator = page.locator('.userElement', { hasText: 'playwrightTest' })
  const userSpecialty = userLocator.locator('.userSpecialties').locator('.userSpecialty')
  await expect(userSpecialty.first().getByText('marketing', { exact: true })).toBeVisible()
  await userSpecialty
    .last()
    .getByText('close', { exact: true })
    .click()
  await page
    .getByText('La spécialité a été supprimée', { exact: true })
    .waitFor({ state: 'visible' })
  await page.reload()
  await page.waitForTimeout(1000)
  await page.getByText('Spécialistes', { exact: true }).click()
  await expect(userSpecialty.first().getByText('sales', { exact: true })).toBeHidden()
})

test('Should be able to translate the question and answer', async ({ page }) => {
  await setUser(page, { id: user })
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await expect(page.getByRole('button', { name: 'translate' })).toBeVisible()
  await page.getByRole('button', { name: 'translate' }).hover()
  await page.getByText('Anglais', { exact: true }).click()
  await expect(page.getByRole('heading', { name: 'This is a question' })).toBeVisible()
  await expect(page.getByText('Traduction automatique', { exact: true })).toBeVisible()
  await expect(page.getByText('This is an answer', { exact: true })).toBeVisible()
})

test('Should modify the content of the translation when the question and answer are modified', async ({
  page
}) => {
  await setUser(page, { id: user })
  await createQuestionAndAnswerWithoutTranslation(prisma, tag.id, user)
  await page.goto('/')
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'translate' }).hover()
  await page.getByText('Anglais', { exact: true }).click()
  await expect(page.getByRole('heading', { name: 'This is a question' })).toBeVisible()
  await expect(page.getByText('This is an answer', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page.getByText('editQuestion', { exact: true }).click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une question différente')
  await page.getByRole('button', { name: 'Enregistrer la question' }).click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page.getByText('question_answerRéponse', { exact: true }).click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('Ceci est une réponse différente')
  await page.getByRole('button', { name: 'Enregistrer la réponse' }).click()
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'translate' }).hover()
  await page.getByText('Anglais', { exact: true }).click()
  await expect(page.getByRole('heading', { name: 'This is a different question' })).toBeVisible()
  await expect(page.getByText('This is a different answer', { exact: true })).toBeVisible()
})

test('Should be able, as a specialist, to give my specialty to other users', async ({ page }) => {
  await setUser(page, { specialties: [{ name: 'marketing' }], id: user })
  await page.goto('/')
  await page.getByRole('img', { name: 'avatar' }).hover()
  await page.getByRole('link', { name: "Paramètres" }).click()
  await page.getByText('Spécialistes', { exact: true }).click()
  const userLocator = page.locator('.userElement', { hasText: 'tempUser' }).first()
  const userSpecialty = userLocator.locator('.userSpecialties').locator('.userSpecialty')
  await expect(userSpecialty.first().getByText('payroll')).toBeVisible()
  const addSpecialty = userLocator.locator('.userRight').getByRole('button', { name: 'add' })
  await addSpecialty.click()
  await userLocator.getByRole('button', { name: 'marketing' }).click()
  await page
    .getByText('La spécialité a été ajoutée', { exact: true })
    .waitFor({ state: 'visible' })
  await page.reload()
  await page.waitForTimeout(1000)
  await page.getByText('Spécialistes', { exact: true }).click()
  await expect(userSpecialty.last().getByText('marketing')).toBeVisible()
})

test.afterEach(async () => {
  algolia.clearIndex({ prisma })
})

test.afterAll(async () => {
  await emptyDb(apiContext, deleteCommands)
  await apiContext.dispose()
})
