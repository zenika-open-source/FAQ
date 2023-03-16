import { expect, test } from '@playwright/test'

// let token;

// const exec = require('child_process').exec
// exec('npm run token demo/dev', (err, stdout) => {
//     token = stdout
//     console.log('stdout:', stdout)
// })

const key = 'playwrightTestKey'

const userData = {
  id: 'clfav2l8e006g0848hl89mvpi',
  admin: false,
  name: 'playwrightTest',
  email: 'playwright.test@zenika.com',
  picture:
    'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
  __typename: 'User'
}

const deleteAnswers = `mutation { 
    deleteManyAnswers {
        count
    }
}`

const deleteQuestions = `mutation { 
    deleteManyQuestions {
        count
    }
}`

const deleteHistoryActions = `mutation { 
    deleteManyHistoryActions {
        count
    }
}`

const deleteFlags = `mutation {
    deleteManyFlags {
        count
    }
}`

const deleteTags = `mutation {
    deleteManyTags {
        count
    }
}`

const deleteZNodes = `mutation { 
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
  'MMMMDCCLXXXVIII - MMMMDCLXXXVIII'
]

const answersText = [
  "Message du futur à 2023 : au secours c'est encore pire",
  'Ceci est une réponse',
  'C',
  '𓁷𓏤𓎟𓀀𓁐𓏥𓃀𓈖𓌱𓅓𓎛𓅱𓀔𓈖𓌱𓅓𓎛𓇋𓇋𓏏𓁐𓐍𓂋𓋴𓂝𓎛𓋩𓉔𓊪𓏛𓋴𓐠𓄿𓂋𓏏𓌗𓀁𓌷𓂝𓏏𓏭𓏛𓇾𓏏𓅓𓅱𓀀𓁐𓏪𓃀𓌢𓌢𓈖𓈖𓏛'
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

let apiContext

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    baseURL: 'http://localhost:4000',
    extraHTTPHeaders: {
      Authorization: `API ${process.env.REACT_APP_PLAYWRIGHT_TOKEN}`,
      'faq-tenant': 'default/default'
    }
  })
})

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/auth/login')
  await page.evaluate(userData => {
    window.localStorage.setItem('user', JSON.stringify(userData))
  }, userData)
  await page.goto('http://localhost:3000')
  await page.pause()
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

test('Should be able to create a question and answers it', async ({ page }) => {
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
  await page.getByRole('button', { name: 'local_offer' }).click()
  await page.locator('.category-item', { hasText: tagsText[randomTag] }).click()
  // check good tag
  await page
    .locator('.open-card')
    .first()
    .click()
  await expect(
    page.getByRole('heading', { name: questionsText[randomQuestion] }).click()
  ).toBeVisible()
  await page
    .locator('a')
    .filter({ hasText: 'historyobsolète' })
    .click()
  await expect(page.getByText('historyObsolète', { exact: true })).toBeVisible()
})

test('Should be able to add a tag to a question', async () => {
  await page.locator('input[type=text]').click()
  await page.locator('input[type=text]').fill(questionsText[randomQuestion])
  await page
    .locator('.open-card')
    .first()
    .click()
  await page
    .locator('a')
    .filter({ hasText: 'Question' })
    .click()
  await page.getByRole('button', { name: 'add' }).click()
  await page.getByText(tagsText[randomAddTag], { exact: true }).click()
  await page.locator('button', { hasText: 'Enregistrer la question' }).click()
  await expect(page.getByText(tagsText[randomTag], tagsText[randomAddTag])).toBeVisible()
})

test('Should be able to modify an answer', async () => {
  await page.locator('input[type=text]').click()
  await page.locator('input[type=text]').fill(questionsText[randomQuestion])
  await page
    .locator('.open-card')
    .first()
    .click()
  await page
    .locator('a')
    .filter({ hasText: 'Réponse' })
    .click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill(answersText[randomEditAnswer])
  await page.locator('button', { hasText: 'Enregistrer la réponse' }).click()
  await expect(page.getByText(answersText[randomEditAnswer])).toBeVisible()
})

test('Should be able to answer a question than has no answer', async ({ page }) => {
  await page
    .locator('div:nth-child(2) > div:nth-child(3) > div')
    .filter({ hasText: 'help_outline' })
    .first()
    .locator('.open-card')
    .click()
  await expect(page.getByText('Pas encore de réponse...')).toBeVisible()
  await page.locator('button', { hasText: 'Répondre à la question' }).click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill(answersText[randomAnswer])
  await page.locator('button', { hasText: 'Envoyer la réponse' }).click()
  await expect(page.getByText(answersText[randomAnswer])).toBeVisible()
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
  // deleteManyAnswers / deleteManyQuestions / deleteManyHistoryActions / deleteManyFlags / deleteTags and deleteManyZNodes
  const responseAnswers = await apiContext.post('/gql', {
    data: {
      query: deleteAnswers
    }
  })
  const jsonResponse = await responseAnswers.json()
  console.log('jsonResponse: ', jsonResponse)
  const responseQuestions = await apiContext.post('/', {
    data: {
      query: deleteQuestions
    }
  })
  const responseHistory = await apiContext.post('/', {
    data: {
      query: deleteHistoryActions
    }
  })
  const responseFlags = await apiContext.post('/', {
    data: {
      query: deleteFlags
    }
  })
  const responseTags = await apiContext.post('/', {
    data: {
      query: deleteTags
    }
  })
  const responseZNodes = await apiContext.post('/', {
    data: {
      query: deleteZNodes
    }
  })
  await apiContext.dispose()
})
