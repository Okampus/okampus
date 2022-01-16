import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/views/LandingPage.vue')
    },

    {
        path: '/admin',
        component: () => import('@/views/Dashboard/AdminDashboard.vue')
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
        path: '/posts',
        component: () => import('@/views/Thread/ThreadList.vue')
    },

    {
        path: '/posts/ask',
        component: () => import('@/views/Thread/ThreadNew.vue')
    },

    {
        path: '/posts/:id',
        component: () => import('@/views/Thread/ThreadCompactView.vue'),
    },

    {
        path: '/docs',
        component: () => import('@/views/Document/DocumentList.vue')
    },

    {
        path: '/docs/upload',
        component: () => import('@/views/Document/DocumentNew.vue')
    },

    {
        path: '/users/me',
        component: () => import('@/views/UserSettings.vue')
    },

    {
        path: '/users/:userId',
        component: () => import('@/views/ProfileShow.vue')
    },

    {
        path: '/users/me/favorites',
        component : () => import('@/views/FavoritesPage.vue')
    },

    ...[{ ...(import.meta.env.DEV && {
        path: '/test',
        component: () => import('@/views/Test/TestPage.vue')
    }) }],
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
