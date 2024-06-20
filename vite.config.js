/*
 * @Author: DiChen
 * @Date: 2024-06-18 15:11:47
 * @LastEditors: DiChen
 * @LastEditTime: 2024-06-19 16:43:46
 */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //解决跨域问题
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        ws: true, //代理websocked
        changeOrigin: true, //虚拟的站点需要更管origin
        secure: true, //是否https接口
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
