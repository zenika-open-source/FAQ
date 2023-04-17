import { defineConfig } from '@playwright/test'
export default defineConfig({
  reporter: process.env.CI && [['junit', { outputFile: 'results.xml' }]],
  use: {
    trace: process.env.CI && 'on',
    headless: true,
    locale: 'fr-FR',
    baseURL: 'http://localhost:4466',
    extraHTTPHeaders: {
      Authorization: token,
      'faq-tenant': 'default/default'
    }
  }
})
