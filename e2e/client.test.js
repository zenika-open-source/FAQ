import { expect, test } from '@playwright/test'
import { refreshConfiguration } from '../server/src/middlewares/configuration'
const path = require('path')
const multiTenant = require('../server/src/multiTenant')
const algolia = require('../server/src/integrations/algolia')
const algoliaSettings = require('../server/scripts/algolia_settings/index')

const createUser = `mutation CreateUser{
  createUser(data: {key: "playwrightTest", name: "playwrightTest", email: "playwright.test@zenika.com"}) {
    id
  }
}`

const createUserMutation = async apiContext => {
  const res = await apiContext.post('/', {
    data: {
      query: createUser
    }
  })
  const jsonRes = await res.json()
  const results = await jsonRes.data.createUser
  const { id: userId } = await results
  return { userId }
}

const tagsId = `query GetAllTags{
  tagLabels {
    id
    name
  }
}`

const tagsIdQuery = async apiContext => {
  const res = await apiContext.post('/', {
    data: {
      query: tagsId
    }
  })
  const jsonRes = await res.json()
  const results = await jsonRes.data.tagLabels
  const randomNumber = Math.floor(Math.random() * results.length)
  let randomAddNumber = Math.floor(Math.random() * results.length)
  do {
    randomAddNumber = Math.floor(Math.random() * results.length)
  } while (randomNumber === randomAddNumber)
  const tagLabel = await results[randomNumber]
  const tagAddLabel = await results[randomAddNumber]
  const { id: tagId, name: tagName } = await tagLabel
  const { id: tagAddId, name: tagAddName } = await tagAddLabel
  return { tagId, tagName, tagAddId, tagAddName }
}

const deleteAll = field => {
  return `mutation DeleteAll{
      ${field} {
        count
      }
    }`
}

const questionsText = [
  'Ceci est une question',
  "Message de 2023 au futur : le réchauffement climatique c'est vraiment nul",
  "En fait, il n'y a aucune question",
  '𓇋𓅱𓄙𓅓 ... bonne chance pour faire fonctionner la recherche avec ça',
  'Lorem ipsum ...',
  'MMMMDCCLXXXVIII - MMMMDCLXXXVIII',
  'Vous êtes libre de changer les textes des questions'
]

const answersText = [
  "Message du futur à 2023 : au secours c'est encore pire",
  'Ceci est une réponse',
  'C',
  '𓁷𓏤𓎟𓀀𓁐𓏥𓃀𓈖𓌱𓅓𓎛𓅱𓀔𓈖𓌱𓅓𓎛𓇋𓇋𓏏𓁐𓐍𓂋𓋴𓂝𓎛𓋩𓉔𓊪𓏛𓋴𓐠𓄿𓂋𓏏𓌗𓀁𓌷𓂝𓏏𓏭𓏛𓇾𓏏𓅓𓅱𓀀𓁐𓏪𓃀𓌢𓌢𓈖𓈖𓏛',
  'Vous avez aussi le droit de modifier le texte des réponses'
]

const uniqueRandom = (obj, ...compareNumbers) => {
  let uniqueNumber
  do {
    uniqueNumber = Math.floor(Math.random() * obj.length)
  } while (compareNumbers.includes(uniqueNumber))
  return uniqueNumber
}

const randomQuestion = uniqueRandom(questionsText)
const randomEditQuestion = uniqueRandom(questionsText, randomQuestion)

const randomAnswer = uniqueRandom(answersText)
const randomEditAnswer = uniqueRandom(answersText, randomAnswer)

const createZNodeParams = (tagId, userId) => {
  return {
    data: {
      question: {
        create: {
          title: questionsText[randomQuestion],
          slug: 'slug.' + questionsText[randomQuestion],
          user: {
            connect: {
              id: userId
            }
          }
        }
      },
      answer: {
        create: {
          content: answersText[randomAnswer],
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
          title: questionsText[randomQuestion],
          slug: 'slug.' + questionsText[randomQuestion],
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

let apiContext
let prisma
let tags
let user

test.beforeAll(async ({ playwright }) => {
  const PATH = path.resolve(process.cwd(), '..')
  const execSync = require('child_process').execSync
  const token = execSync('npm run --silent token default/default', {
    cwd: `${PATH}/server`
  })
    .toString()
    .trim()
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
  refreshConfiguration(prisma)
  algoliaSettings
  user = await createUserMutation(apiContext)
  tags = await tagsIdQuery(apiContext)
})

test.beforeEach(async ({ page }) => {
  await apiContext.post('/', {
    data: {
      query: deleteAll('deleteManyAnswers')
    }
  })
  await apiContext.post('/', {
    data: {
      query: deleteAll('deleteManyQuestions')
    }
  })
  await apiContext.post('/', {
    data: {
      query: deleteAll('deleteManyHistoryActions')
    }
  })
  await apiContext.post('/', {
    data: {
      query: deleteAll('deleteManyFlags')
    }
  })
  await apiContext.post('/', {
    data: {
      query: deleteAll('deleteManyTags')
    }
  })
  await apiContext.post('/', {
    data: {
      query: deleteAll('deleteManyZNodes')
    }
  })
  await page.goto('http://localhost:3000/auth/login')
  await page.evaluate(user => {
    const userData = {
      id: user.userId,
      admin: false,
      name: 'playwrightTest',
      email: 'playwright.test@zenika.com',
      picture:
        'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      __typename: 'User'
    }
    window.localStorage.setItem('user', JSON.stringify(userData))
  }, user)
})

test('Shoud be able to create a question', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator('input').click()
  await page.locator('input').fill(questionsText[randomQuestion])
  await page.getByRole('button', { name: 'add' }).click()
  await page.getByText(tags.tagName, { exact: true }).click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await expect(page.getByRole('heading', { name: questionsText[randomQuestion] })).toBeVisible()
})

test('Should be able to create a question and answer it', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator('input[type=text]').click()
  await page.locator('input[type=text]').fill(questionsText[randomQuestion])
  await page.getByRole('button', { name: 'add' }).click()
  await page.getByText(tags.tagName, { exact: true }).click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await expect(page.getByRole('heading', { name: questionsText[randomQuestion] })).toBeVisible()
  await page.locator('button', { hasText: 'Répondre à la question' }).click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill(answersText[randomAnswer])
  await page.locator('button', { hasText: 'Envoyer la réponse' }).click()
  await expect(page.getByText(answersText[randomAnswer], { exact: true })).toBeVisible()
})

test('Should return a search result', async ({ page }) => {
  const zNode = await prisma.mutation.createZNode(createZNodeParams(tags.tagId, user.userId))
  await algolia.addNode({ prisma }, zNode.id)
  await page.goto('http://localhost:3000')
  await page.locator('input[type=text]').click()
  const slicedQuestion = questionsText[randomQuestion].slice(0, 4)
  await page.locator('input[type=text]').fill(slicedQuestion)
  await expect(
    page.getByRole('heading', { name: questionsText[randomQuestion] }).first()
  ).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await expect(page.getByRole('heading', { name: questionsText[randomQuestion] })).toBeVisible()
})

test('Should not return results', async ({ page }) => {
  await page.locator('input[type=text]').click()
  await page.locator('input[type=text]').fill('test')
  await expect(page.getByText('Aucune question trouvée')).toBeVisible()
})

test('Should be able to signal a question', async ({ page }) => {
  const zNode = await prisma.mutation.createZNode(createZNodeParams(tags.tagId, user.userId))
  await algolia.addNode({ prisma }, zNode.id)
  await page.goto('http://localhost:3000')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'local_offer' }).click()
  await page.locator('.category-item', { hasText: tags.tagName }).click()
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
  const zNode = await prisma.mutation.createZNode(createZNodeParams(tags.tagId, user.userId))
  await algolia.addNode({ prisma }, zNode.id)
  await page.goto('http://localhost:3000')
  await page.locator('input[type=text]').click()
  const slicedQuestion = questionsText[randomQuestion].slice(0, 6)
  await page.locator('input[type=text]').fill(slicedQuestion)
  await expect(
    page.getByRole('heading', { name: questionsText[randomQuestion] }).first()
  ).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'editQuestion' })
    .click()
  await page.getByRole('button', { name: 'add' }).click()
  await page.getByText(tags.tagAddName, { exact: true }).click()
  await page.locator('button', { hasText: 'Enregistrer la question' }).click()
  await expect(page.getByText(tags.tagName, tags.tagAddName)).toBeVisible()
})

test('Should be able to modify an answer for an already answered question', async ({ page }) => {
  const zNode = await prisma.mutation.createZNode(createZNodeParams(tags.tagId, user.userId))
  await algolia.addNode({ prisma }, zNode.id)
  await page.goto('http://localhost:3000')
  await page.locator('input[type=text]').click()
  await page.locator('input[type=text]').fill(questionsText[randomQuestion])
  await expect(
    page.getByRole('heading', { name: questionsText[randomQuestion] }).first()
  ).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Réponse' })
    .click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill(answersText[randomEditAnswer])
  await page.locator('button', { hasText: 'Enregistrer la réponse' }).click()
  await expect(page.getByText(answersText[randomEditAnswer], { exact: true })).toBeVisible()
})

test('Should be able to answer a question that has no answer', async ({ page }) => {
  const zNode = await prisma.mutation.createZNode(
    createZNodeWithoutAnswerParams(tags.tagId, user.userId)
  )
  await algolia.addNode({ prisma }, zNode.id)
  await page.goto('http://localhost:3000')
  await expect(page.getByText('Pas encore de réponse...')).toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.locator('button', { hasText: 'Répondre à la question' }).click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill(answersText[randomAnswer])
  await page.locator('button', { hasText: 'Envoyer la réponse' }).click()
  await expect(page.getByText(answersText[randomAnswer], { exact: true })).toBeVisible()
})

test('Should be able to search by text and tag', async ({ page }) => {
  const zNode = await prisma.mutation.createZNode(createZNodeParams(tags.tagId, user.userId))
  await algolia.addNode({ prisma }, zNode.id)
  await page.goto('http://localhost:3000')
  await page.locator('input[type=text]').click()
  await page.locator('input[type=text]').fill(questionsText[randomQuestion])
  await expect(page.getByText('Aucune question trouvée')).not.toBeVisible()
  await expect(
    page.getByRole('heading', { name: questionsText[randomQuestion] }).first()
  ).toBeVisible()
  await page.getByRole('button', { name: 'local_offer' }).click()
  await page.locator('.category-item', { hasText: tags.tagName }).click()
  await expect(page.getByText('Aucune question trouvée')).not.toBeVisible()
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await expect(openCard).toBeVisible()
  await openCard.click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Réponse' })
    .click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill(answersText[randomEditAnswer])
  await page.locator('button', { hasText: 'Enregistrer la réponse' }).click()
  await expect(page.getByText(answersText[randomEditAnswer], { exact: true })).toBeVisible()
})

test.afterEach(async () => {
  algolia.clearIndex({ prisma })
})

test.afterAll(async () => {
  await apiContext.dispose()
})
