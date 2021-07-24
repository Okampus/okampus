import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import App from '../App.vue'
import QueryResult from '@/components/QueryResult.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: QueryResult
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
