import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import telecall from '../../plugins/rollup-plugin-telecall'

export default defineConfig({
  build: {
    outDir: '../server0/public',
    emptyOutDir: true,
  },
  plugins: [
    {
      ...telecall({
        server0: {
          targetPath: '../server0/src/api',
          endpoint: 'http://localhost:4000/api',
          sessionTokenPersistence: 'cookie',
        },
        server1: {
          targetPath: '../server1/src/api',
          endpoint: 'http://localhost:4100/api',
          sessionTokenPersistence: 'cookie',
        },
      }),
      enforce: 'pre',
    },
    vue(),
  ],
})
