import { createRouter, createWebHashHistory } from 'vue-router'
import Landing from '@/views/LandingPage.vue'
import default_avatar from '@/assets/img/default_avatars/user.png'

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
        component: () => import('@/views/Post/ThreadCompactView.vue'),
        props: {
            thread: {
                views: 194,
                createdAt: '2021-02-04T13:51:36.631Z',
                updatedAt: '2021-03-04T13:51:36.631Z',
                post: {
                    createdAt: '2021-02-04T13:51:36.631Z',
                    updatedAt: '2021-03-04T13:51:36.631Z',
                    upvotes: 69,
                    title: 'Les ordinateurs sur la deuxième rangée en salle E103 ne fonctionnent plus !',
                    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut nihil reprehenderit esse aperiam odit dignissimos, praesentium quia blanditiis autem atque molestias officiis deleniti magnam libero a? Optio recusandae totam soluta! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit optio, praesentium obcaecati facere quasi',
                    creator: {
                        pseudo: 'Pseudo',
                        role: 'Rôle',
                        img: default_avatar
                    },
                    comments: [
                        {
                            author: 'Pseudo',
                            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
                            likes: '185'
                        },
                        {
                            author: 'Pseudo',
                            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
                            likes: '185'
                        },
                        {
                            author: 'Pseudo',
                            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
                            likes: '185'
                        }]
                },
                replies: [{
                    upvotes: 69,
                    title: 'Les ordinateurs sur la deuxième rangée en salle E103 ne fonctionnent plus !',
                    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut nihil reprehenderit esse aperiam odit dignissimos, praesentium quia blanditiis autem atque molestias officiis deleniti magnam libero a? Optio recusandae totam soluta! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit optio, praesentium obcaecati facere quasi',
                    creator: {
                        pseudo: 'Pseudo',
                        role: 'Role',
                        img: default_avatar
                    },
                    comments: [
                        {
                            author: 'Pseudo',
                            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
                            likes: 185
                        },
                        {
                            author: 'Pseudo',
                            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
                            likes: 185
                        },
                        {
                            author: 'Pseudo',
                            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
                            likes: 185
                        }]
                },
                {
                    upvotes: 69,
                    title: 'Les ordinateurs sur la deuxième rangée en salle E103 ne fonctionnent plus !',
                    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut nihil reprehenderit esse aperiam odit dignissimos, praesentium quia blanditiis autem atque molestias officiis deleniti magnam libero a? Optio recusandae totam soluta! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit optio, praesentium obcaecati facere quasi',
                    creator: {
                        pseudo: 'Pseudo',
                        role: 'Role',
                        img: default_avatar
                    },
                    responses: [
                        {
                            author: 'Pseudo',
                            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
                            likes: 185
                        },
                        {
                            author: 'Pseudo',
                            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
                            likes: 1851
                        },
                        {
                            author: 'Pseudo',
                            content: 'Neque iudicantibus lacrimae maestitia filium maeror certe quod iudicantibus autem parentis .',
                            likes: 185
                        }]
                }],
                tags: [
                    {
                        title: 'TagExample',
                        color: '#add8e6'
                    },
                    {
                        title: 'OneTag',
                        color: '#ef4444'
                    },
                    {
                        title: 'Tags',
                        color: '#ffb6c1'
                    },
                    {
                        title: 'Example',
                        color: '#ffa500'
                    }
                ],
                similarThreads: [
                    {
                        title: 'Probleme dans la salle 7',
                        tags: [
                            {
                                title: 'Tag',
                                color: '#add8e6'
                            },
                            {
                                title: 'Tag',
                                color: '#add8e6'
                            },
                            {
                                title: 'Tag',
                                color: '#add8e6'
                            }
                        ]
                    },
                    {
                        title: 'Probleme de professeur',
                        tags: [
                            {
                                title: 'Tag',
                                color: '#add8e6'
                            },
                            {
                                title: 'Tag',
                                color: '#add8e6'
                            },
                            {
                                title: 'Tag',
                                color: '#ef4444'
                            }
                        ]
                    },
                    {
                        title: 'Probleme dans la salle 7',
                        tags: [
                            {
                                title: 'Tag',
                                color: '#add8e6'
                            },
                            {
                                title: 'Tag',
                                color: '#add8e6'
                            },
                            {
                                title: 'Tag',
                                color: '#add8e6'
                            }
                        ]
                    }
                ],
                contributors: [
                    {
                        img: default_avatar,
                        pseudo: 'Pseudo1'
                    },
                    {
                        img: default_avatar,
                        pseudo: 'Pseudo2'
                    },
                    {
                        img: default_avatar,
                        pseudo: 'Pseudo3'
                    },
                    {
                        img: default_avatar,
                        pseudo: 'Pseudo4'
                    }
                ]
            }
        }
    },

    {
        path: '/new-post',
        component: () => import('@/views/Post/PostNew.vue')
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
        component: () => import('@/views/Post/PostList.vue')
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
