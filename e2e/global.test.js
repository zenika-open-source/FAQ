import { expect, test } from '@playwright/test'
const path = require('path')
const multiTenant = require('../server/src/multiTenant')
const algolia = require('../server/src/integrations/algolia')

const key = 'playwrightTestKey'

const userData = {
  id: 'clfc9wtox003m0870xwtx87so',
  admin: false,
  name: 'playwrightTest',
  email: 'playwright.test@zenika.com',
  picture:
    'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
  __typename: 'User'
}

const deleteAnswers = `mutation DeleteAnswers{ 
    deleteManyAnswers {
        count
    }
}`

const deleteQuestions = `mutation DeleteQustions{ 
    deleteManyQuestions {
        count
    }
}`

const deleteHistoryActions = `mutation DeleteHistoryActions{ 
    deleteManyHistoryActions {
        count
    }
}`

const deleteFlags = `mutation DeleteFlags{
    deleteManyFlags {
        count
    }
}`

const deleteTags = `mutation DeleteTags{
    deleteManyTags {
        count
    }
}`

const deleteZNodes = `mutation DeleteZNodes{ 
    deleteManyZNodes {
        count
    }
}`

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

const tagsText = ['paris', 'nantes', 'tutorial', 'meta']

const randomQuestion = Math.floor(Math.random() * questionsText.length)
let randomEditQuestion = Math.floor(Math.random() * questionsText.length)

const randomAnswer = Math.floor(Math.random() * answersText.length)
let randomEditAnswer = Math.floor(Math.random() * answersText.length)

const randomTag = Math.floor(Math.random() * tagsText.length)
let randomAddTag = Math.floor(Math.random() * tagsText.length)

do {
  randomEditQuestion = Math.floor(Math.random() * questionsText.length)
} while (randomQuestion === randomEditQuestion)

do {
  randomEditAnswer = Math.floor(Math.random() * answersText.length)
} while (randomAnswer === randomEditAnswer)

do {
  randomAddTag = Math.floor(Math.random() * tagsText.length)
} while (randomTag === randomAddTag)

const ZNodeParams = { data: { question: questionsText[randomQuestion] } }

let apiContext
let prisma

/* A LANCER DANS BASH POUR OBTENIR LE TOKEN */

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
  console.log(prisma)
})

// multiTenant.current
// nettoyer moteur de recherche avant chaque test (deleteIndex)
// create question avec ZNode, récupérer l'id et l'envoyer a algolia.addNode
// addNode pour algolia
// rendre tests indépendants

test.beforeEach(async ({ page }) => {
  algolia.deleteIndex({ prisma })
  await apiContext.post('/', {
    data: {
      query: deleteAnswers
    }
  })
  await apiContext.post('/', {
    data: {
      query: deleteQuestions
    }
  })
  await apiContext.post('/', {
    data: {
      query: deleteHistoryActions
    }
  })
  await apiContext.post('/', {
    data: {
      query: deleteFlags
    }
  })
  await apiContext.post('/', {
    data: {
      query: deleteTags
    }
  })
  await apiContext.post('/', {
    data: {
      query: deleteZNodes
    }
  })
  await page.goto('http://localhost:3000/auth/login')
  await page.evaluate(userData => {
    window.localStorage.setItem('user', JSON.stringify(userData))
  }, userData)
  await page.goto('http://localhost:3000')
})

test('Shoud be able to create a question', async ({ page }) => {
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator('input').click()
  await page.locator('input').fill(questionsText[randomQuestion])
  await page.getByRole('button', { name: 'add' }).click()
  await page.getByText(tagsText[randomTag], { exact: true }).click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await expect(page.getByRole('heading', { name: questionsText[randomQuestion] })).toBeVisible()
})

test('Should be able to create a question and answer it', async ({ page }) => {
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator('input[type=text]').click()
  await page.locator('input[type=text]').fill(questionsText[randomQuestion])
  await page.getByRole('button', { name: 'add' }).click()
  await page.getByText(tagsText[randomTag], { exact: true }).click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await expect(page.getByRole('heading', { name: questionsText[randomQuestion] })).toBeVisible()
  await page.locator('button', { hasText: 'Répondre à la question' }).click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill(answersText[randomAnswer])
  await page.locator('button', { hasText: 'Envoyer la réponse' }).click()
  await expect(page.getByText(answersText[randomAnswer], { exact: true })).toBeVisible()
})

test('Should return a search result', async ({ page }) => {
  await page.locator('input[type=text]').click()
  await page.locator('input[type=text]').fill(questionsText[randomQuestion])
  await expect(
    page.getByRole('heading', { name: questionsText[randomQuestion] }).first()
  ).toBeVisible()
  await page
    .locator('.open-card')
    .first()
    .click()
  await expect(
    page.getByRole('heading', { name: questionsText[randomQuestion] }).click()
  ).toBeVisible()
})

test('Should not return results', async ({ page }) => {
  await page.locator('input[type=text]').click()
  await page.locator('input[type=text]').fill('test')
  await expect(page.getByText('Aucune question trouvée')).toBeVisible()
})

test('Should be able to signal a question', async ({ page }) => {
  const zNode = await prisma.mutation.createZNode(ZNodeParams)
  algolia.addNode({ prisma }, zNode.id)
  await page.getByRole('button', { name: 'local_offer' }).click()
  // await page.locator('.category-item', { hasText: tagsText[randomTag] }).click()
  // check good tag
  await page
    .locator('.open-card')
    .first()
    .click()
  await page.getByRole('button', { name: 'Signaler' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'historyobsolète' })
    .click()
  await expect(page.locator('span.label', { hasText: 'Obsolète' })).toBeVisible()
})

test('Should be able to add a tag to a question', async ({ page }) => {
  // await page.locator('input[type=text]').click()
  // await page.locator('input[type=text]').fill(questionsText[randomQuestion])
  await page
    .locator('.open-card')
    .first()
    .click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'editQuestion' })
    .click()
  await page.getByRole('button', { name: 'add' }).click()
  await page.getByText(tagsText[randomAddTag], { exact: true }).click()
  await page.locator('button', { hasText: 'Enregistrer la question' }).click()
  await expect(page.getByText(tagsText[randomTag], tagsText[randomAddTag])).toBeVisible()
})

test('Should be able to modify an answer for an already answered question', async ({ page }) => {
  // await page.locator('input[type=text]').click()
  // await page.locator('input[type=text]').fill(questionsText[randomQuestion])
  await page
    .locator('.open-card')
    .first()
    .click()
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

test('Should be able to answer a question than has no answer', async ({ page }) => {
  await page
    .locator('div:has(i:text("help_outline")) + a.open-card')
    .first()
    .click()
  await expect(page.getByText('Pas encore de réponse...')).toBeVisible()
  await page.locator('button', { hasText: 'Répondre à la question' }).click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill(answersText[randomAnswer])
  await page.locator('button', { hasText: 'Envoyer la réponse' }).click()
  await expect(page.getByText(answersText[randomAnswer], { exact: true })).toBeVisible()
})

test('Should be able to search by text and tag', async ({ page }) => {
  await page.locator('input[type=text]').click()
  await page.locator('input[type=text]').fill(questionsText[randomQuestion])
  await expect(page.getByText('Aucune question trouvée')).not.toBeVisible()
  await expect(page.getByRole('heading', { name: questionsText[randomQuestion] })).toBeVisible()
  await page.getByRole('button', { name: 'local_offer' }).click()
  await page.locator('.category-item', { hasText: tagsText[randomTag] }).click()
  await expect(page.getByText('Aucune question trouvée')).not.toBeVisible()
  // check for good tag
  await page.getByRole('link', { name: 'keyboard_arrow_right' }).click()
  await page
    .locator('a')
    .filter({ hasText: 'Réponse' })
    .click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill(questionsText[randomEditQuestion])
  await page.locator('button', { hasText: 'Enregistrer la question' }).click()
  await expect(page.getByText(questionsText[randomEditQuestion])).toBeVisible()
})

test.afterAll(async () => {
  await apiContext.dispose()
})
