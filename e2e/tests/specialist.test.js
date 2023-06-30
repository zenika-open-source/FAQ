import { expect, test } from '@playwright/test'
import { beforeAll, beforeEach, createQuestionWithFlag } from '../helpers'

const before = async () => {
  const { tag, tempUser, prisma, apiContext } = await beforeAll()
  beforeEach(apiContext)
  return {
    tag,
    prisma,
    tempUser
  }
}

const { tag, prisma, tempUser } = before()

test('Should see the marketing specialty on profile page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('img', { name: 'avatar' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Profil' })
    .click()
  await expect(page.getByText('verifiedmarketing')).toBeVisible()
})

test('Should not be able to add a certified flag to an unanswered question', async ({ page }) => {
  await page.goto('/')
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator('input').click()
  await page.locator('input').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText('marketing', { exact: true })
    .first()
    .click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await page.getByRole('button', { name: 'flag Signaler ...' }).hover()
  await expect(page.locator('a').filter({ hasText: 'verifiedcertifiée' })).toBeHidden()
})

test('Should be able to add a certified flag for a question of my specialty', async ({ page }) => {
  await page.goto('/')
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator('input').click()
  await page.locator('input').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText('marketing', { exact: true })
    .first()
    .click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await page.locator('button', { hasText: 'Répondre à la question' }).click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill('Ceci est une réponse')
  await page.locator('button', { hasText: 'Envoyer la réponse' }).click()
  await page.getByRole('button', { name: 'flag Signaler ...' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'verifiedcertifiée' })
    .click()
  await page.waitForTimeout(1000)
  await page.goto('/')
  await expect(page.getByText('verified')).toBeVisible()
})

test('Should not be able to add a certified flag for a question not in my specialty', async ({
  page
}) => {
  await page.goto('/')
  await page
    .locator('button', { hasText: 'Nouvelle question' })
    .first()
    .click()
  await page.locator('input').click()
  await page.locator('input').fill('Ceci est une question')
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .getByText('ce', { exact: true })
    .first()
    .click()
  await page.locator('button', { hasText: 'Envoyer la question' }).click()
  await page.locator('button', { hasText: 'Répondre à la question' }).click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill('Ceci est une réponse')
  await page.locator('button', { hasText: 'Envoyer la réponse' }).click()
  await page.getByRole('button', { name: 'flag Signaler ...' }).hover()
  await expect(page.locator('a').filter({ hasText: 'verifiedcertifiée' })).toBeHidden()
})

test('Should remove the certified flag after modifying an answer', async ({ page }) => {
  await createQuestionWithFlag(prisma, tag.id, tempUser)
  await page.goto('/')
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await expect(page.getByText('verifiedCertifiée')).toBeVisible()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Réponse' })
    .click()
  await page.locator('textarea').click()
  await page.locator('textarea').fill('Ceci est une réponse différente')
  await page.locator('button', { hasText: 'Enregistrer la réponse' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('verifiedCertifiée')).toBeHidden()
})

test('Should remove the certified flag when the corresponding tag is deleted', async ({ page }) => {
  await createQuestionWithFlag(prisma, tag.id, tempUser)
  await page.goto('/')
  const openCard = page.getByRole('link', { name: 'keyboard_arrow_right' }).first()
  await openCard.waitFor('visible')
  await openCard.click()
  await expect(page.getByText('verifiedCertifiée')).toBeVisible()
  await page.getByRole('button', { name: 'Modifier' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'editQuestion' })
    .click()
  await page
    .locator('.tag', { hasText: 'payroll' })
    .locator('.material-icons')
    .click()
  await page.locator('button', { hasText: 'Enregistrer la question' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('verifiedCertifiée')).toBeHidden()
})

test('Should be able to add a specialty to a user', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('img', { name: 'avatar' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Paramètres' })
    .click()
  await page.getByText('Spécialistes').click()
  const user = page.locator('.userElement', { hasText: 'enableSkipAuth' })
  const userSpecialty = user.locator('.userSpecialties').locator('.userSpecialty')
  await expect(userSpecialty.first().locator('span')).toHaveText('marketing')
  const addSpecialty = user.locator('.userRight').getByRole('button', { hasText: 'add' })
  await addSpecialty.click()
  await user.getByRole('button', { name: 'sales' }).click()
  await page
    .locator('.alert-content', { hasText: 'La spécialité a été ajoutée' })
    .waitFor({ state: 'visible' })
  await page.reload()
  await page.waitForTimeout(1000)
  await page.getByText('Spécialistes').click()
  await expect(userSpecialty.last().locator('span')).toHaveText('sales')
})

test("Should be able to remove a user's specialty", async ({ page }) => {
  await page.goto('/')
  await page.getByRole('img', { name: 'avatar' }).hover()
  await page
    .locator('a')
    .filter({ hasText: 'Paramètres' })
    .click()
  await page.getByText('Spécialistes').click()
  const user = page.locator('.userElement', { hasText: 'enableSkipAuth' })
  const userSpecialty = user.locator('.userSpecialties').locator('.userSpecialty')
  await expect(userSpecialty.first().locator('span')).toHaveText('marketing')
  await userSpecialty
    .last()
    .getByText('close', { exact: true })
    .click()
  await page
    .locator('.alert-content', { hasText: 'La spécialité a été supprimée' })
    .waitFor({ state: 'visible' })
  await page.reload()
  await page.waitForTimeout(1000)
  await page.getByText('Spécialistes').click()
  await expect(userSpecialty.first().locator('span', { hasText: 'sales' })).toBeHidden()
})
