import { defineConfig } from '@playwright/test'

export default defineConfig({
  reporter: process.env.CI && [['junit', { outputFile: 'results.xml' }]],
  use: {
    trace: process.env.CI && 'on',
    screenshot: process.env.CI && 'on',
    video: process.env.CI && 'on',
    workers: process.env.CI ? 2 : undefined,
    headless: true,
    locale: 'fr-FR',
    baseURL: 'http://localhost:3000'
  }
})
