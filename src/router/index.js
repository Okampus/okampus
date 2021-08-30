import { createRouter, createWebHistory } from 'vue-router'
import SearchQuery from '@/components/SearchQuery.vue'
import Thread from '@/components/Thread.vue'

const routes = [
  {
    path: '/',
    component: SearchQuery
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
