import { defineConfig } from '@playwright/test'
export default defineConfig({
  reporter: process.env.CI && [['junit', { outputFile: 'results.xml' }]],
  use: {
    headless: true,
    locale: 'fr-FR'
  }
})
