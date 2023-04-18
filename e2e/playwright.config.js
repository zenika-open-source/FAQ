import { defineConfig } from '@playwright/test'
export default defineConfig({
  reporter: process.env.CI && [['junit', { outputFile: 'results.xml' }]],
  use: {
    trace: process.env.CI && 'on',
    headless: true,
    locale: 'fr-FR',
    navigationTimeout: 30 * 1000
  },
  globalTimeout: 60 * 60 * 1000
})
