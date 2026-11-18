import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { templateCompilerOptions } from '@tresjs/core'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  plugins: [
    vue({
      ...templateCompilerOptions,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
  },
  ssr: {
    // 这些包只在客户端动态加载，SSG 渲染阶段不打包进服务端产物
    noExternal: ['@vue-flow/core', '@vue-flow/background', '@vue-flow/controls'],
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    dirStyle: 'nested',
    beastiesOptions: false,
  },
})
