import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import telecall from '../../plugins/rollup-plugin-telecall'

export default defineConfig({
  build: {
    outDir: '../server0/public',
    emptyOutDir: true,
  },
  plugins: [
    telecall({
      '../server0/src/api': 'http://localhost:4000/api',
      '../server1/src/api': 'http://localhost:4100/api',
    }),
    vue(),
  ],
})
