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

// const createUser = `mutation {
//     createUser(data: { key: "playwrightTestKey", name: "playwrightTest", email: "playwright.test@zenika.com" }) {
//         id
//         key
//         name
//         email
//     }
// }`

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

const userData = {
  id: 'clex1fr9t4a3l0847oetlj4u9',
  auth0Id: '102822211611447380835',
  admin: false,
  name: 'Thibaud BRAULT',
  email: 'thibaud.brault@zenika.com',
  picture: 'https://lh3.googleusercontent.com/a/AGNmyxbf0Z8paF3zMglkviKbIet71DxfcvsFyxk88lg1=s96-c',
  __typename: 'User'
}

const sessionData = {
  accessToken:
    'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly96ZW5pa2EuZXUuYXV0aDAuY29tLyJ9..ryduIVn781W4zuTx.nS1G-ySCG--iuPhrcItFxRH-bth3C3aQf1atkZbiRL4JNFnI_Vn2u_RybvAryXVnZ6n8JlpvfGHWuJq3lbnoyp_hLfGiEWWN611PidNdkUceHXBESOFs5dCNaj90q9EfhrY73oxHrLNtukiwNcTOHYQXjJkz1xI5RMlpk06PAXU95dWDtwBEdT1tBirtnDE6R7CuRAcA_qFTfJQg1n_U8WRCPck2rzTmLoXzV4NxK9yM79LU79jkdz7ETN6nGpXQj08ICwbbpEoAmxfEE757IPIElJgxuUJ3I2ghqLFXca8aXbogt5ijHBrLq-aXm8QuMT8u8d6MPyYx2-gbo_oC_oMjuWHcNkq94E17rO8zUxX-Y1_dLH2CWxjWuOP7ij5_lUWzJqEDOolDGQurBOkbKtdWwyMJ3RqFGR33OCKPvvLMHsJjb90aHA1D4SubiJ2VM2FxdBBWaCvhSUPlLieR3rOmKqx3t7gJ5ccnV5fkRRAu6E8wnn7DSnAqEk4xqQL4b88EKwef4RitwLkls8DJHu9g_YY_3HO9GbpvBwf5ePd7RDQlbCX2tyJbarHc6v_jMldxAP6D0sQE1JPH6DXgMsKJ9Zj8gd_nTEYiV9jIl7l3NEBxdxDzEMcQBUVdmYSafhgq7LTjIUkrVGWQElP1KyPS4w.6uyezPtMdAzCZW4hasweyw',
  idToken:
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5EQXdPRVk1T0VGQ1JURXdRek0xTlVKRE56ZEdOREpHT0RZeFFqZ3pNVEpHTlRrM1EwSkZRZyJ9.eyJnaXZlbl9uYW1lIjoiVGhpYmF1ZCAiLCJmYW1pbHlfbmFtZSI6IkJSQVVMVCIsIm5pY2tuYW1lIjoidGhpYmF1ZC5icmF1bHQiLCJuYW1lIjoiVGhpYmF1ZCBCUkFVTFQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4YmYwWjhwYUYzek1nbGt2aUtiSWV0NzFEeGZjdnNGeXhrODhsZzE9czk2LWMiLCJsb2NhbGUiOiJmciIsInVwZGF0ZWRfYXQiOiIyMDIzLTAzLTE1VDEwOjU4OjU1LjI4M1oiLCJlbWFpbCI6InRoaWJhdWQuYnJhdWx0QHplbmlrYS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly96ZW5pa2EuZXUuYXV0aDAuY29tLyIsImF1ZCI6IndxOExVMWY1aVhRNEhXTDBGNlowN1FEY1NNZ1dQZDFwIiwiaWF0IjoxNjc4ODgzNDQwLCJleHAiOjE2Nzg5MTk0NDAsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTAyODIyMjExNjExNDQ3MzgwODM1IiwiYXRfaGFzaCI6IlczOFU2RjlSTkttVlhnaGZ6SzJfZlEiLCJzaWQiOiJreGpSa3RzbkhFbmV4LVdabFBQTkFIUzVoRDBrZGVKTCIsIm5vbmNlIjoiWlV0M3dibDExR2tncllPZS5wSnhGSS14QmNzYWlOMXYifQ.Gi7lX-SD8bQM73fRoEEAiZpLUCeFBM8fCLXYeiVAkxHcODrr-1ckmPHcu2cl4fMoTqi4cTkF8Nv2NXlxeix2iCa96W1cG0XwywC3V0pX-XQVvD5z-L7yH_16Gy7fVd1qYeaHztMVBi-ouMJqBupE9nYsNaluTcKwUHeTtbEpZQBU1dZJimO03BY3Xv1HPTxIT-j_xqnW086NT4EuyqC-8jxOHMSOxdimaDvtdv9EWEJ926a7eHRcvUD5dQabd2H2ajJYhG6FZdc5dzYb0scQqSh1mGwmhHZg2f_qPNgUDKmtcNBwaGeCkbG589Gv1BR9rjlyr-huC9HsCNeAsTWFQw',
  idTokenPayload: {
    given_name: 'Thibaud ',
    family_name: 'BRAULT',
    nickname: 'thibaud.brault',
    name: 'Thibaud BRAULT',
    picture:
      'https://lh3.googleusercontent.com/a/AGNmyxbf0Z8paF3zMglkviKbIet71DxfcvsFyxk88lg1=s96-c',
    locale: 'fr',
    updated_at: '2023-03-15T10:58:55.283Z',
    email: 'thibaud.brault@zenika.com',
    email_verified: true,
    iss: 'https://zenika.eu.auth0.com/',
    aud: 'wq8LU1f5iXQ4HWL0F6Z07QDcSMgWPd1p',
    iat: 1678883440,
    exp: 1678919440,
    sub: 'google-oauth2|102822211611447380835',
    at_hash: 'W38U6F9RNKmVXghfzK2_fQ',
    sid: 'kxjRktsnHEnex-WZlPPNAHS5hD0kdeJL',
    nonce: 'ZUt3wbl11GkgrYOe.pJxFI-xBcsaiN1v'
  },
  appState: 'Kyql02VdtmMh7N0UJdboj5Tdy3xyqJvh',
  refreshToken: null,
  state: 'Kyql02VdtmMh7N0UJdboj5Tdy3xyqJvh',
  expiresIn: 7200,
  tokenType: 'Bearer',
  scope: 'openid profile email',
  expiresAt: 1678890640531
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/auth/login')
  // await page.addInitScript(() => {
  //     window.localStorage.setItem('user', JSON.stringify(userData))
  //     window.localStorage.setItem('session', sessionData)
  // })
  await page.evaluate(
    ({ userData, sessionData }) => {
      window.localStorage.setItem('user', JSON.stringify(userData))
      window.localStorage.setItem('session', JSON.stringify(sessionData))
      window.localStorage.setItem('accessToken', sessionData.idToken)
    },
    { userData, sessionData }
  )
  await page.pause()
  await page.goto('http://localhost:3000')
  await page.pause()
})

test('Should go to home page', async ({ page }) => {
  await page.getByText('Latest questions').click()
})

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
