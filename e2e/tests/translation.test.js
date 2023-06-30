import { expect, test } from '@playwright/test'
import {
  beforeAll,
  beforeEach,
  createQuestionAndAnswer,
  createQuestionAndAnswerWithoutTranslation
} from '../helpers'

const before = async () => {
  const { tag, prisma, user, apiContext } = await beforeAll()
  beforeEach(apiContext)
  return {
    tag,
    prisma,
    user
  }
}

const { tag, prisma, user } = before()

test('Should be able to translate the question and answer', async ({ page }) => {
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await expect(page.getByRole('button', { name: 'translate' })).toBeVisible()
  await page.getByRole('button', { name: 'translate' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Anglais' })
    .click()
  await expect(page.getByRole('heading', { name: 'This is a question' })).toBeVisible()
  await expect(page.getByText('Traduction automatique')).toBeVisible()
  await expect(page.getByText('This is an answer')).toBeVisible()
})

test('Should add a translation to a question and an answer created without one', async ({
  page
}) => {
  await createQuestionAndAnswerWithoutTranslation(prisma, tag.id, user)
  await page.goto('/')
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'editQuestion' })
    .click()
  await page.locator('input').click()
  await page.locator('input').fill('Ceci est une question différente')
  await page.locator('button', { hasText: 'Enregistrer la question' }).click()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Réponse' })
    .click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill('Ceci est une réponse différente')
  await page.locator('button', { hasText: 'Enregistrer la réponse' }).click()
  await page.getByRole('button', { name: 'translate' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Anglais' })
    .click()
  await expect(page.getByRole('heading', { name: 'This is a different question' })).toBeVisible()
  await expect(page.getByText('This is a different answer')).toBeVisible()
})
