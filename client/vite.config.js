const path = require('path')
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
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
      port: 3000,
      proxy: {
        '/rest': {
          target: env.VITE_SERVER_URL,
          changeOrigin: true,
          secure: false
        },
        '/gql': {
          target: env.VITE_SERVER_URL,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
