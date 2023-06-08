const path = require('path')
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      contexts: path.resolve(__dirname, 'src/contexts'),
      helpers: path.resolve(__dirname, 'src/helpers'),
      scenes: path.resolve(__dirname, 'src/scenes'),
      services: path.resolve(__dirname, 'src/services'),
      styles: path.resolve(__dirname, 'src/styles')
    }
  },
  build: {
    outDir: 'build'
  },
  server: {
    open: process.env.CI !== 'true',
    port: 3000
  }
})
