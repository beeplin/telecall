import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import telecall from '../../plugins/rollup-plugin-telecall'

export default defineConfig({
  build: {
    outDir: '../server/public',
    emptyOutDir: true,
  },
  plugins: [
    telecall({
      include: '../server/src/**/*.tele(.ts|.js|)',
      root: '../server/',
    }),
    vue(),
  ],
})
