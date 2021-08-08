import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import telecall from '../../plugins/rollup-plugin-telecall'

export default defineConfig({
  build: {
    outDir: '../server/public',
    emptyOutDir: true,
  },
  plugins: [
    {
      ...telecall({
        include: '../server/src/**/*.api.(ts|js)',
        root: '../server/src',
        endpoint: 'http://localhost:4000/api',
        persistence: 'localStorage',
      }),
      enforce: 'pre',
    },
    vue(),
  ],
})
