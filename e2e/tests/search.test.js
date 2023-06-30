import { expect, test } from '@playwright/test'
import { beforeAll, beforeEach, createQuestionAndAnswer } from '../helpers'

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

test('Should return a search result', async ({ page }) => {
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.locator("input:near(:text('search'))").click()
  await page.locator("input:near(:text('search'))").fill('Ceci est une question')
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

test('Should be able to search by text and tag', async ({ page }) => {
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.waitForTimeout(2000)
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
