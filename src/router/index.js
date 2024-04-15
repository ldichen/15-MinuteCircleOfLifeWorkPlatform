import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login.vue'
import WorkPlatform from '@/views/mainPages/workPlatform.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
