import { errorCodes } from '@/shared/errors/app-exceptions.enum'
import { emitter } from '@/shared/modules/emitter'
import localStore from '@/store/local.store'
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
        name: 'search',
        path: '/search/:tab*',
        component: () => import('@/views/App/SearchResults.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/admin/:tab*',
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
        path: '/rgpd',
        component: () => import('@/views/App/PrivacyPolicy.vue'),
    },

    {
        path: '/forum',
        component: () => import('@/views/ForumHome.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/forum/posts',
        component: () => import('@/views/List/ThreadList.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'forum-new',
        path: '/forum/new/:tab*',
        component: () => import('@/views/Thread/ThreadNew.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'post',
        path: '/forum/post/:id*',
        component: () => import('@/views/Thread/ThreadView.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/wiki',
        component: () => import('@/views/App/WIP.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/docs',
        component: () => import('@/views/App/WIP.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    // {
    //     path: '/docs/new',
    //     component: () => import('@/views/Document/DocumentNew.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    {
        path: '/restaurant',
        component: () => import('@/views/App/WIP.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/lost-found',
        component: () => import('@/views/App/WIP.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: '/community',
        component: () => import('@/views/App/WIP.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'me',
        path: '/me/:tab*',
        component: () => import('@/views/User/UserSettings.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    // {
    //     path: '/me/favorites',
    //     component: () => import('@/views/User/UserFavorites.vue'),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },

    {
        name: 'users',
        path: '/users',
        component: () => import('@/views/List/UserList.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'user',
        path: '/user/:userId',
        component: () => import('@/views/Profile/ProfileUserAsync.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    // {
    //     name: 'crous',
    //     path: '/crous/daily/:date',
    //     component: () => import('@/views/Crous/CrousPage.vue'),
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

    {
        name: 'clubs',
        path: '/clubs/:tab*',
        component: () => import('@/views/List/ClubList.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'manage-club',
        path: '/club/:clubId/manage/:tab*',
        component: () => import('@/views/Profile/ManageClub.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'club',
        path: '/club/:clubId/:tab*',
        component: () => import('@/views/Profile/ProfileClub.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'events',
        path: '/events',
        component: () => import('@/views/List/EventList.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    {
        name: 'event',
        path: '/event/:eventId',
        component: () => import('@/views/TeamEvent.vue'),
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
            requiresAuth: false,
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
    if (to.meta?.requiresAuth && !localStore.loggedIn) {
        emitter.emit('error-route', { code: errorCodes.UNAUTHORIZED, path: to.path })
    }

    if (to.meta?.hasPermission && !localStore.hasPermission()) {
        emitter.emit('error-route', { code: errorCodes.FORBIDDEN, path: to.path })
    }

    if (to.hash) {
        emitter.emit('scroll-to-anchor', to.hash)
    }
})

export default router
