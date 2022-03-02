import { emitter } from '@/shared/modules/emitter'
import { useAuthStore } from '@/store/auth.store'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/views/App/LandingPage.vue'),
        meta: {
            requiresAuth: false,
        },
    },

    {
        path: '/admin/:tab',
        component: () => import('@/views/Dashboard/DashboardAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/auth',
        component: () => import('@/views/App/AuthPage.vue'),
    },

    {
        path: '/articles',
        component: () => import('@/views/Blog/BlogList.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/articles/new',
        component: () => import('@/views/Blog/BlogNew.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/articles/:id',
        component: () => import('@/views/Blog/BlogShow.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/articles/admin',
        component: () => import('@/views/Blog/BlogAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/threads',
        component: () => import('@/views/Thread/ThreadHome.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/threads/new',
        component: () => import('@/views/Thread/ThreadNew.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'threads',
        path: '/threads/:id',
        component: () => import('@/views/Thread/ThreadView.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/docs',
        component: () => import('@/views/Document/DocumentList.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/docs/new',
        component: () => import('@/views/Document/DocumentNew.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/me/favorites',
        component: () => import('@/views/User/UserFavoriteList.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/me/:component',
        component: () => import('@/views/User/UserMyProfile.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/users/:userId',
        component: () => import('@/views/User/UserProfile.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/users',
        component: () => import('@/views/User/UserList.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'crous',
        path: '/crous/daily/:date',
        component: () => import('@/views/Crous/CrousView.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/crous/new',
        component: () => import('@/views/Crous/CrousNew.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/App/AppException.vue'),
        props: {
            code: '404',
        },
        meta: {
            requiresAuth: true,
        },
    },
]

if (import.meta.env.DEV) {
    routes.push({
        path: '/test',
        component: () => import('@/views/App/TestPage.vue'),
        meta: {
            requiresAuth: true,
        },
    })
}

const router = createRouter({
    history: import.meta.env.DEV ? createWebHashHistory() : createWebHistory(),
    routes,
})

router.afterEach((to) => {
    const auth = useAuthStore()
    if (to.meta?.requiresAuth && !auth.loggedIn) {
        emitter.emit('error-route', { code: '401', path: to.path })
    }
})

export default router
