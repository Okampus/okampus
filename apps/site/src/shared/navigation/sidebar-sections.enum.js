import { useAuthStore } from '@/store/auth.store'
import { computed } from 'vue'

export const sections = computed(() => {
    const auth = useAuthStore()
    return [
        ...(import.meta.env.DEV
            ? [
                  {
                      name: 'Dév',
                      links: [
                          {
                              to: '/test/',
                              regActive: /^\/test/,
                              textSmall: 'Page test',
                              textLarge: 'Page de test',
                              icon: 'vial',
                          },
                      ],
                  },
              ]
            : []),

        ...(auth.loggedIn && auth.user.roles.includes('admin')
            ? [
                  {
                      name: 'Admin',
                      links: [
                          //   {
                          //       to: '/admin/threads',
                          //       regActive: /^\/admin\/threads/,
                          //       textSmall: 'Admin',
                          //       textLarge: 'Modération',
                          //       icon: 'columns',
                          //   },
                          {
                              to: '/admin/clubs/',
                              regActive: /^\/admin\/clubs/,
                              textSmall: 'Admin',
                              textLarge: 'Administration',
                              icon: 'screwdriver-wrench',
                          },
                      ],
                  },
              ]
            : []),

        // ...(auth.loggedIn
        //     ? [
        //           {
        //               name: 'Forum',
        //               links: [
        //                   {
        //                       to: '/threads',
        //                       regActive: /^\/threads(?!\/new)/,
        //                       textSmall: 'Forum',
        //                       textLarge: 'Efrei Forum',
        //                       icon: 'comments',
        //                   },
        //                   {
        //                       to: '/threads/new',
        //                       regActive: /^\/threads\/new$/,
        //                       textSmall: 'Poster',
        //                       textLarge: 'Créer un post',
        //                       icon: 'question-circle',
        //                   },
        //               ],
        //           },
        //       ]
        //     : []),

        // ...(auth.loggedIn
        //     ? [
        //           {
        //               name: 'Okampus Cloud',
        //               links: [
        //                   {
        //                       to: '/docs',
        //                       regActive: /^\/docs(?!\/new)/,
        //                       textSmall: 'Documents',
        //                       textLarge: 'Tous les documents',
        //                       icon: 'folder',
        //                   },
        //                   {
        //                       to: '/docs/new',
        //                       regActive: /^\/docs\/new$/,
        //                       textSmall: 'Uploader',
        //                       textLarge: 'Ajouter un fichier',
        //                       icon: 'upload',
        //                   },
        //               ],
        //           },
        //       ]
        //     : []),

        // ...(auth.loggedIn
        //     ? [
        //           {
        //               name: 'Crous',
        //               links: [
        //                   {
        //                       to: '/crous/daily/today',
        //                       regActive: /^\/crous(?!\/new)/,
        //                       textSmall: 'Menu',
        //                       textLarge: 'Menu du Crous',
        //                       icon: 'utensils',
        //                   },
        //                   {
        //                       to: '/crous/new',
        //                       regActive: /^\/crous\/new$/,
        //                       textSmall: 'Crous',
        //                       textLarge: 'Gestion du Crous',
        //                       icon: 'apple-alt',
        //                   },
        //               ],
        //           },
        //       ]
        //     : []),

        // {
        //     name: 'Pause Café',
        //     links: [
        //         {
        //             to: '/articles',
        //             regActive: /^\/articles(?!\/new)/,
        //             textSmall: 'News',
        //             textLarge: 'News & Blog',
        //             icon: 'newspaper',
        //         },
        //         {
        //             to: '/articles/new',
        //             regActive: /^\/articles\/new$/,
        //             textSmall: 'Publier',
        //             textLarge: 'Écrire un article',
        //             icon: 'pen-alt',
        //         },
        //     ],
        // },

        ...(auth.loggedIn
            ? [
                  {
                      name: 'Espaces',
                      links: [
                          {
                              to: '/forum/',
                              regActive: /^\/forum?/,
                              textSmall: 'Forum',
                              textLarge: 'Forum',
                              icon: 'comments',
                              button: {
                                  text: 'Créer un post',
                                  to: '/forum/post/new',
                                  icon: 'circle-plus',
                              },
                          },
                          {
                              to: '/clubs/',
                              regActive: /^\/clubs?/,
                              textSmall: 'Assos',
                              textLarge: 'Associations',
                              icon: 'people-group',
                          },
                          {
                              to: '/events/',
                              regActive: /^\/events?/,
                              textSmall: 'Evénements',
                              textLarge: 'Evénements',
                              icon: 'calendar-days',
                          },
                      ],
                  },
                  {
                      name: 'Services',
                      links: [
                          {
                              to: '/docs/',
                              regActive: /^\/docs?/,
                              textSmall: 'Documents',
                              textLarge: 'Documents',
                              icon: 'file',
                          },
                          {
                              to: '/restaurant/',
                              regActive: /^\/restaurant?/,
                              textSmall: 'Cantine',
                              textLarge: 'Cantine',
                              icon: 'utensils',
                          },
                          {
                              to: '/lost-found/',
                              regActive: /^\/lost-found?/,
                              textSmall: 'Objets',
                              textLarge: 'Objets trouvés',
                              icon: 'recycle',
                          },
                          {
                              to: '/wiki/',
                              regActive: /^\/wiki?/,
                              textSmall: 'Wiki',
                              textLarge: 'Wiki interne',
                              icon: 'info',
                          },
                      ],
                  },
                  {
                      name: 'Communauté',
                      links: [
                          {
                              to: '/community/',
                              regActive: /^\/community/,
                              textSmall: 'Communauté',
                              textLarge: 'Communauté',
                              icon: 'icons',
                          },
                          {
                              to: '/users/',
                              regActive: /^\/(users?|me)/,
                              textSmall: 'Profils',
                              textLarge: 'Utilisateurs',
                              icon: 'user-group',
                              button: {
                                  text: 'Mon compte',
                                  to: '/me',
                                  icon: 'user-cog',
                              },
                          },
                          //   {
                          //       to: '/me/favorites',
                          //       regActive: /^\/me\/favorites/,
                          //       textSmall: 'Mes favoris',
                          //       textLarge: 'Mes favoris',
                          //       icon: 'crown',
                          //   },
                      ],
                  },
              ]
            : []),
    ]
})
