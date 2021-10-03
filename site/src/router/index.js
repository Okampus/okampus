import { createRouter, createWebHistory } from 'vue-router'
import Content from '@/components/Content.vue'
import PostView from '@/pages/Post/PostView.vue'
import PostNew from '@/pages/Post/PostNew.vue'
import Login from '@/pages/Login.vue'
import PostList from '@/pages/Post/PostList.vue'

const routes = [
  {
    path: '/',
    component: Content
  },
  {
    path: '/post',
    component: PostView
  },
  {
    path: '/new_post',
    component: PostNew
  },

  {
    path: '/login',
    component: Login
  },

  {
    path: '/posts',
    component: PostList
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
