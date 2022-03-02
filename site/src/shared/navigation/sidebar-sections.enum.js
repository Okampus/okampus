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
                              to: '/test',
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
                          {
                              to: '/admin/threads',
                              regActive: /^\/admin/,
                              textSmall: 'Admin',
                              textLarge: 'Modération',
                              icon: 'columns',
                          },
                      ],
                  },
              ]
            : []),

        ...(auth.loggedIn
            ? [
                  {
                      name: 'Forum',
                      links: [
                          {
                              to: '/threads',
                              regActive: /^\/threads(?!\/new)/,
                              textSmall: 'Forum',
                              textLarge: 'Efrei Forum',
                              icon: 'comments',
                          },
                          {
                              to: '/threads/new',
                              regActive: /^\/threads\/new$/,
                              textSmall: 'Poster',
                              textLarge: 'Créer un post',
                              icon: 'question-circle',
                          },
                      ],
                  },
              ]
            : []),

        ...(auth.loggedIn
            ? [
                  {
                      name: 'Horizon Cloud',
                      links: [
                          {
                              to: '/docs',
                              regActive: /^\/docs(?!\/new)/,
                              textSmall: 'Documents',
                              textLarge: 'Tous les documents',
                              icon: 'folder',
                          },
                          {
                              to: '/docs/new',
                              regActive: /^\/docs\/new$/,
                              textSmall: 'Uploader',
                              textLarge: 'Ajouter un fichier',
                              icon: 'upload',
                          },
                      ],
                  },
              ]
            : []),

        ...(auth.loggedIn
            ? [
                  {
                      name: 'Crous',
                      links: [
                          {
                              to: '/crous/daily/today',
                              regActive: /^\/crous(?!\/new)/,
                              textSmall: 'Menu du jour',
                              textLarge: 'Menu du Crous',
                              icon: 'utensils',
                          },
                          {
                              to: '/crous/new',
                              regActive: /^\/crous\/new$/,
                              textSmall: 'Crous',
                              textLarge: 'Gestion du Crous',
                              icon: 'apple-alt',
                          },
                      ],
                  },
              ]
            : []),

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
                      name: 'Communauté',
                      links: [
                          {
                              to: '/users/',
                              regActive: /^\/users/,
                              textSmall: 'Utilisateurs',
                              textLarge: 'Utilisateurs',
                              icon: 'users',
                          },
                          {
                              to: '/me/profile',
                              regActive: /^\/me\/profile/,
                              textSmall: 'Compte',
                              textLarge: 'Mon compte',
                              icon: 'user-cog',
                          },
                          {
                              to: '/me/favorites',
                              regActive: /^\/me\/favorites/,
                              textSmall: 'Mes favoris',
                              textLarge: 'Mes favoris',
                              icon: 'crown',
                          },
                      ],
                  },
              ]
            : []),
    ]
})
