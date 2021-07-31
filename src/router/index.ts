import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import App from '../App.vue'
import SearchQuery from '@/components/SearchQuery.vue'
import Thread from '@/components/Thread.vue'

const routes: Array<RouteRecordRaw> = [
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
