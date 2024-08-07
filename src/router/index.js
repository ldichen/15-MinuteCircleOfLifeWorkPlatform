/*
 * @Author: DiChen
 * @Date: 2024-06-18 15:11:47
 * @LastEditors: DiChen
 * @LastEditTime: 2024-07-18 10:38:53
 */
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Login from '@/views/login.vue'
import WorkPlatform from '@/views/mainPages/workPlatform.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // redirect: '/workPlatform',
      name: 'Login',
      component: Login
    },
    {
      path: '/workPlatform',
      name: 'WorkPlatform',
      component: WorkPlatform
    }
  ]
})

export default router
