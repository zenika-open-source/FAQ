import { defineConfig } from '@playwright/test'
export default defineConfig({
  reporter: process.env.CI
    ? [
        [
          'junit',
          {
            outputFile: 'results.xml'
          }
        ]
      ]
    : [
        [
          'json',
          {
            outputFile: 'report.json'
          }
        ],
        [
          'html',
          {
            open: 'on-failure'
          }
        ]
      ],
  use: {
    locale: 'fr-FR'
  }
})
