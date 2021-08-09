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
        server: {
          include: '../server/src/**/*.api(.ts|.js|.cjs|.mjs|)',
          root: '../server/src',
          endpoint: 'http://localhost:4000/api',
          persistence: 'localStorage',
        },
      }),
      enforce: 'pre',
    },
    vue(),
  ],
})
