import { expect, test } from '@playwright/test'

/* Will create a token when running tests  */

// let token;

// const exec = require('child_process').exec
// exec('npm run token demo/dev', (err, stdout) => {
//     token = stdout
//     console.log('stdout:', stdout)
// })

// console.log('token:', token)

let apiContext

/* Create a context to use with request */

// test.beforeAll(async ({ playwright }) => {
//     apiContext = await playwright.request.newContext({
//         baseURL: 'http://localhost:4 ',
//         extraHTTPHeaders: {
//             'Authorization': `API ${process.env.REACT_APP_PLAYWRIGHT_TOKEN}`,
//             'faq-tenant': 'demo/dev',
//         }
//     })
// })

// test.afterAll(async ({ }) => {
//     await apiContext.dispose()
// })

const createUser = `mutation {
    createUser(data: { key: "playwrightTestKey", name: "playwrightTest", email: "playwright.test@zenika.com" }) {
        id
        admin
        key
        name
        email
    }
}`

// const getUserbyId = `query {
//     user(where: {id: "clf9oslci00j10870v00rkg8q"}) {
//         name
//         email
//     }
// }`

// test('should create a new user', async () => {
//     const response = await apiContext.post('/', {
//         data: {
//             query: createUser
//         }
//     })
//     console.log(response)
//     expect(response.ok()).toBeTruthy()
// })

// test('should get user info', async () => {
//     const response = await apiContext.post('/gql', {
//         data: {
//             query: getUserbyId
//         }
//     })
//     console.log(response)
// })

const key = 'playwrightTestKey'

const userData = {
  id: 'clf9tpozq020u0870xl5bqw97',
  // auth0Id: '102822211611447380835',
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

const deleteZNodes = `mutation { 
    deleteManyZNodes {
        count
    }
}`

const questionsText = [
  'Ceci est une question',
  "Message de 2023 au futur : le réchauffement climatique c'est chiant",
  "En fait, il n'y a aucune question",
  '𓀿 𓀡'
]

const randomNb = Math.floor(Math.random() * questionsText.length)

test.beforeEach(async ({ page }) => {
  // deleteManyAnswers / deleteManyQuestions / deleteManyHistoryctions and deleteManyZNodes
  await page.goto('http://localhost:3000/auth/login')
  await page.evaluate(userData => {
    window.localStorage.setItem('user', JSON.stringify(userData))
  }, userData)
  await page.goto('http://localhost:3000')
  await page.pause()
})

test('Shoud be able to create a question', async ({ page }) => {
  await page
    .locator('text=Nouvelle question')
    .first()
    .click()
  await page.locator('input').click()
  await page.locator('input').fill(questionsText[randomNb])
  await page.locator('text=Envoyer la question').click()
  await page.pause()
})

// test('Question should appear after creation', async ({ page }) => {
//     await page.getByRole('button', { name: 'record_voice_over New question' }).click();
//     await page.getByPlaceholder('E.g.: How to fill an expense report?').click();
//     await page.getByPlaceholder('E.g.: How to fill an expense report?').fill('test');
//     await page.getByRole('button', { name: 'Submit' }).click();
//     expect(page.getByRole('heading', { name: 'test' })).toBeVisible();
// })

// test('Answer should appear under the question', async ({ page }) => {
//     await page.locator('div').filter({ hasText: 'testhelp_outlinekeyboard_arrow_right' }).getByRole('link', { name: 'keyboard_arrow_right' }).click();
//     await page.getByRole('button', { name: 'question_answer Answer the question' }).click();
//     await page.getByTestId('text-area').click();
//     await page.getByTestId('text-area').fill('test answer');
//     await page.getByRole('button', { name: 'Submit answer' }).click();
//     await page.getByText('test answer').click();
// })
