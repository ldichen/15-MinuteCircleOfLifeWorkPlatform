/*
 * @Author: DiChen
 * @Date: 2024-06-18 15:11:47
 * @LastEditors: DiChen
 * @LastEditTime: 2024-07-18 15:09:28
 */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const config = loadEnv(mode, './')
  const server = { proxy: {} }
  server.proxy[config.VITE_BASE_URL] = {
    target: config.VITE_TARGET,
    ws: true, //代理websocked
    changeOrigin: true, //虚拟的站点需要更管origin
    // secure: true, //是否https接口
    rewrite: (path) => path.replace(config.VITE_BASE_URL, '')
  }

  return {
    base: './',
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server

    //解决跨域问题
    // server: {
    //   // host: '223.2.34.239',
    //   proxy: {
    //     '/api': {
    //       target: config.VITE_TARGET,
    //       ws: true, //代理websocked
    //       changeOrigin: true, //虚拟的站点需要更管origin
    //       // secure: true, //是否https接口
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     }
    //   }
    // }
  }
})
