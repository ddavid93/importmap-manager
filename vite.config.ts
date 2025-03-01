import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    }
  },
  build: {
    cssCodeSplit: true,
    lib: {
      formats: ['umd'],
      entry: './src/main.ts',
      name: 'importmap-manager',
      fileName: (format) => `importmap-manager.${format}.js`
    }
  },
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
