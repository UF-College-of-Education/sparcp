import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import mdx from '@mdx-js/rollup'
import path from 'node:path'

// https://vitejs.dev/config/
// BasicSsl will only load on vite dev
export default defineConfig(({ command }) => ({
  plugins: [mdx(), react(), ...(command === 'serve' ? [basicSsl()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ['**/*.txt'],
  server: {
    port: 5173,
  },
}))