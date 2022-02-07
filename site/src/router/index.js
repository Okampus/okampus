import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/views/App/LandingPage.vue'),
    },

    {
        path: '/admin/:component',
        component: () => import('@/views/Dashboard/DashboardAdmin.vue'),
    },

    {
        path: '/auth',
        component: () => import('@/views/App/AuthPage.vue'),
    },

    {
        path: '/articles',
        component: () => import('@/views/Blog/BlogList.vue'),
    },

    {
        path: '/articles/new',
        component: () => import('@/views/Blog/BlogNew.vue'),
    },

    {
        path: '/articles/:id',
        component: () => import('@/views/Blog/BlogShow.vue'),
    },

    {
        path: '/articles/admin',
        component: () => import('@/views/Blog/BlogAdmin.vue'),
    },

    {
        path: '/posts',
        component: () => import('@/views/Thread/ThreadList.vue'),
    },

    {
        path: '/posts/new',
        component: () => import('@/views/Thread/ThreadNew.vue'),
    },

    {
        path: '/posts/:id',
        component: () => import('@/views/Thread/ThreadCompactView.vue'),
    },

    {
        path: '/docs',
        component: () => import('@/views/Document/DocumentList.vue'),
    },

    {
        path: '/docs/new',
        component: () => import('@/views/Document/DocumentNew.vue'),
    },

    {
        path: '/me/favorites',
        component: () => import('@/views/User/UserFavoriteList.vue'),
    },

    {
        path: '/me/:component',
        component: () => import('@/views/User/UserMyProfile.vue'),
    },

    {
        path: '/users/:userId',
        component: () => import('@/views/User/UserProfile.vue'),
    },

    {
        path: '/users',
        component: () => import('@/views/User/UserList.vue'),
    },

    {
        path: '/crous',
        component: () => import('@/views/Blog/BlogCrous.vue'),
    },
]

if (import.meta.env.DEV) {
    routes.push({
        path: '/test',
        component: () => import('@/views/App/TestPage.vue'),
    })
}

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
