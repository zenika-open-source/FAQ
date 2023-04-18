import { defineConfig } from '@playwright/test'
export default defineConfig({
  reporter: process.env.CI && [['junit', { outputFile: 'results.xml' }]],
  use: {
    trace: process.env.CI && 'on',
    headless: true,
    locale: 'fr-FR',
    navigationTimeout: 60 * 60 * 1000,
    baseURL: 'http://localhost:3000'
  },
  globalTimeout: 120 * 1000,
  timeout: 120 * 1000
})
