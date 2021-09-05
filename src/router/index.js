import { createRouter, createWebHistory } from 'vue-router'
import Content from '@/components/Content.vue'
import Thread from '@/components/Thread.vue'

const routes = [
  {
    path: '/',
    component: Content
  },
  {
    path: '/thread',
    component: Thread
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
