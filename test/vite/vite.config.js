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
          endpoint: 'http://localhost:4000/api',
          targetPath: '../server/src/api',
        },
      }),
      enforce: 'pre',
    },
    vue(),
  ],
})
