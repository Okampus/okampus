import { createRouter, createWebHistory } from 'vue-router'
import Content from '@/components/Content.vue'
import Thread from '@/components/Thread.vue'
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
    component: Thread
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
