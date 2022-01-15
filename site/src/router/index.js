import { createRouter, createWebHashHistory } from 'vue-router'
import Landing from '@/views/LandingPage.vue'

const routes = [
    {
        path: '/',
        component: Landing
    },
    {
        path: '/info',
        component: Landing
    },
    {
        path: '/rgpd',
        component: Landing
    },
    {
        path: '/horizon',
        component: Landing
    },
    {
        path: '/blog',
        component: () => import('@/views/Blog/BlogList.vue')
    },
    {
        path: '/blog/new',
        component: () => import('@/views/Blog/BlogNew.vue')
    },
    {
        path: '/blog/:id',
        component: () => import('@/views/Blog/BlogShow.vue')
    },
    {
        path: '/blog/admin',
        component: () => import('@/views/Blog/BlogAdmin.vue')
    },
    {
        path: '/post/:id',
        component: () => import('@/views/Thread/ThreadCompactView.vue'),
    },

    {
        path: '/new-post',
        component: () => import('@/views/Thread/PostNew.vue')
    },

    {
        path: '/admin',
        component: () => import('@/views/Dashboard/AdminDashboard.vue')
    },
    {
        path: '/doc/new',
        component: () => import('@/views/Documents/DocNew.vue')
    },

    {
        path: '/doc/list',
        component: () => import('@/views/Documents/DocList.vue')
    },

    {
        path: '/posts',
        component: () => import('@/views/Thread/PostListShow.vue')
    },

    {
        path: '/test',
        component: () => import('@/views/Test/TestPage.vue')
    },

    {
        path: '/settings',
        component: () => import('@/views/UserSettings.vue')
    },

    {
        path: '/profile/:userId',
        component: () => import('@/views/ProfileShow.vue')
    },

    {
        path: '/favorites',
        component : () => import('@/views/FavoritesPage.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
