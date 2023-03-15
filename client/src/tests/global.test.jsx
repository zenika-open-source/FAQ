import { expect, test } from '@playwright/test'

/* Will create a token when running tests  */

let token

const exec = require('child_process').exec
exec('npm run token demo/dev', (err, stdout) => {
  token = stdout
  console.log('stdout:', stdout)
})

console.log('token:', token)

let apiContext

/* Create a context to use with request */

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    baseURL: 'http://localhost:4000',
    extraHTTPHeaders: {
      Authorization: `API ${process.env.REACT_APP_PLAYWRIGHT_TOKEN}`,
      'faq-tenant': 'demo/dev'
    }
  })
})

test.afterAll(async ({}) => {
  await apiContext.dispose()
})

const createUser = `mutation { 
    createUser(data: { key: "playwrightTestKey", name: "playwrightTest", email: "playwright.test@zenika.com" }) { 
        id 
        key 
        name 
        email 
    } 
}`

const getUserbyId = `query {
    user(where: {id: "clf8cj94u011t0848ppj9cck1"}) {
        name
        email
    }
}`

// test('should create a new user', async () => {
//     const response = await apiContext.post('/', {
//         data: {
//             query: createUser
//         }
//     })
//     console.log(response)
//     expect(response.ok()).toBeTruthy()
// })

test('should get user info', async () => {
  const response = await apiContext.post('/gql', {
    data: {
      query: getUserbyId
    }
  })
  console.log(response)
})

// test.beforeEach(async ({ page }) => {
//     await page.addInitScript(() => {
//         window.localStorage.setItem('test', 'hello')
//     })
//     await page.goto('http://localhost:3000/auth/login')
//     await page.getByRole('button', { name: 'fingerprint Sign in' }).click()
//     await page.locator('a').click();
//     await page.getByRole('textbox', { name: 'Adresse e-mail ou numéro de téléphone' }).click();
//     await page.getByRole('textbox', { name: 'Adresse e-mail ou numéro de téléphone' }).click();
//     await page.getByRole('textbox', { name: 'Adresse e-mail ou numéro de téléphone' }).fill('thibaud.brault@zenika.com');
//     await page.getByRole('button', { name: 'Suivant' }).click();
//     await page.getByRole('textbox', { name: 'Saisissez votre mot de passe' }).click();
//     await page.getByRole('textbox', { name: 'Saisissez votre mot de passe' }).fill('2GF8$5k56o1Sv#R#V$mx0D^%');
//     await page.getByRole('button', { name: 'Suivant' }).click();
//     await page.pause()
// })

// test('Should go to home page', async ({ page }) => {
//     await page.getByText('Latest questions').click();
// })

// test.describe('Create a question and answers it', () => {
//     test('Question should appear after creation', async ({ page }) => {
//         await page.getByRole('button', { name: 'record_voice_over New question' }).click();
//         await page.getByPlaceholder('E.g.: How to fill an expense report?').click();
//         await page.getByPlaceholder('E.g.: How to fill an expense report?').fill('test');
//         await page.getByRole('button', { name: 'Submit' }).click();
//         await page.getByRole('heading', { name: 'test' }).click();
//     })
//     test('Answer should appear under the question', async ({ page }) => {
//         await page.locator('div').filter({ hasText: 'testhelp_outlinekeyboard_arrow_right' }).getByRole('link', { name: 'keyboard_arrow_right' }).click();
//         await page.getByRole('button', { name: 'question_answer Answer the question' }).click();
//         await page.getByTestId('text-area').click();
//         await page.getByTestId('text-area').fill('test answer');
//         await page.getByRole('button', { name: 'Submit answer' }).click();
//         await page.getByText('test answer').click();
//     })
// })
