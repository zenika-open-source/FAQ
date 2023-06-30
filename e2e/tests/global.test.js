import { expect, test } from '@playwright/test'
import { beforeAll, beforeEach, createQuestion, createQuestionAndAnswer } from '../helpers'

const before = async () => {
  const { tag, tagEdit, prisma, user, apiContext } = await beforeAll()
  console.log(tag)
  beforeEach(apiContext)
  return {
    tag,
    tagEdit,
    prisma,
    user
  }
}

const { tag, tagEdit, prisma, user } = before()

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

test('Should be able to flag a question', async ({ page }) => {
  await createQuestionAndAnswer(prisma, tag.id, user)
  await page.goto('/')
  await page.waitForTimeout(2000)
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
  await page.locator("input:near(:text('search'))").fill('Ceci est une question')
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
