import { defineConfig } from '@playwright/test'
export default defineConfig({
  // retries: 2,
  use: {
    // trace: 'on-first-retry',
    locale: 'fr-FR'
  }
})
