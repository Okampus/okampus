import { createRouter, createWebHistory } from 'vue-router'
import Content from '@/components/Content.vue'
import viewThread from '@/pages/viewThread.vue'
import NewThread from '@/components/NewThread.vue'
import Login from '@/components/Login.vue'
import ThreadList from '@/components/ThreadList.vue'

const routes = [
  {
    path: '/',
    component: Content
  },
  {
    path: '/thread',
    component: viewThread
  },
  {
    path: '/newthread',
    component: NewThread
  },

  {
    path: '/login',
    component: Login
  },

  {
    path: '/threadlist',
    component: ThreadList
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
