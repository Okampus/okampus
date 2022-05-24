import { errorCodes } from '@/shared/errors/app-exceptions.enum'
import { emitter } from '@/shared/modules/emitter'
import { useAuthStore } from '@/store/auth.store'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const routes = [
    {
        name: 'home',
        path: '/',
        component: () => import('@/views/App/HomePage.vue'),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: '/admin/association',
        component: () => import('@/views/Dashboard/DashboardAssociation.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    // {
    //     path: '/admin/:tab',
    //     component: () => import('@/views/Dashboard/DashboardAdmin.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    {
        path: '/auth',
        component: () => import('@/views/App/AuthPage.vue'),
    },

    // {
    //     path: '/articles',
    //     component: () => import('@/views/Blog/BlogList.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/articles/new',
    //     component: () => import('@/views/Blog/BlogNew.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/articles/:id',
    //     component: () => import('@/views/Blog/BlogShow.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/articles/admin',
    //     component: () => import('@/views/Blog/BlogAdmin.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/threads',
    //     component: () => import('@/views/Thread/ThreadHome.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/threads/new',
    //     component: () => import('@/views/Thread/ThreadNew.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     name: 'threads',
    //     path: '/threads/:id',
    //     component: () => import('@/views/Thread/ThreadView.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/docs',
    //     component: () => import('@/views/Document/DocumentList.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/docs/new',
    //     component: () => import('@/views/Document/DocumentNew.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/me/favorites',
    //     component: () => import('@/views/User/UserFavoriteList.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    {
        path: '/me/:component',
        component: () => import('@/views/User/UserMyProfile.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'users',
        path: '/users',
        component: () => import('@/views/List/UserList.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'profile',
        path: '/user/:userId',
        component: () => import('@/views/User/UserProfile.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    // {
    //     name: 'crous',
    //     path: '/crous/daily/:date',
    //     component: () => import('@/views/Crous/CrousView.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/crous/new',
    //     component: () => import('@/views/Crous/CrousNew.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    // {
    //     path: '/search',
    //     component: () => import('@/views/SearchResults.vue'),
    //     children: [
    //         {
    //             path: 'clubs',
    //             component: () => import('@/views/List/ClubList.vue'),
    //             meta: {
    //                 requiresAuth: true,
    //             },
    //         },
    //         {
    //             path: 'clubs/:tab',
    //             component: () => import('@/views/List/ClubList.vue'),
    //             meta: {
    //                 requiresAuth: true,
    //             },
    //         },
    //     ],
    // },

    {
        path: '/clubs/:tab*',
        name: 'search-clubs',
        component: () => import('@/views/List/ClubList.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/club/:clubId',
        component: () => import('@/views/Clubs/ClubView.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/App/AppException.vue'),
        props: {
            code: errorCodes.NOT_FOUND,
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

// Remove trailing slashes
router.beforeEach((to, _, next) => {
    if (to.fullPath === '/') {
        next()
    } else if (to.fullPath.endsWith('/')) {
        next(to.fullPath.slice(0, -1))
    } else if (to.fullPath.match(/\/\?/)) {
        next(to.fullPath.replace(/\/\?/, '?'))
    } else {
        next()
    }
})

router.afterEach((to) => {
    const auth = useAuthStore()
    if (to.meta?.requiresAuth && !auth.loggedIn) {
        emitter.emit('error-route', { code: errorCodes.UNAUTHORIZED, path: to.path })
    }
})

export default router
