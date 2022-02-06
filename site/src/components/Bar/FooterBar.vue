<template>
    <footer class="pt-6 pb-8 bg-0">
        <div class="flex flex-col gap-4 items-center mx-2/24 md:flex-row md:justify-between md:items-start">
            <div v-for="(section, i) in sections" :key="i" class="text-center md:text-left text-1">
                <h5 class="mb-3 font-bold text-blue-600 uppercase">{{ section.name }}</h5>
                <ul>
                    <li v-for="(link, j) in section.links" :key="j">
                        <AppLink :link="link" class="link" />
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<script>
    import AppLink from '../App/AppLink.vue'
    export default {
        components: { AppLink },
        data() {
            return {
                sections: [
                    {
                        name: 'Espaces',
                        links: [
                            {
                                name: 'Efrei Forum',
                                to: '/posts',
                            },
                            {
                                name: 'Horizon Cloud',
                                to: '/docs',
                            },
                            {
                                name: 'News & Blog',
                                to: '/articles',
                            },
                        ],
                    },
                    {
                        name: 'Communauté',
                        links: [
                            {
                                name: 'Lots à gagner 2022',
                                to: '/contests/lots-a-gagner-2022',
                                class: 'text-gradient-gold font-bold',
                            },
                            {
                                name: 'Utilisateurs',
                                to: '/users',
                            },
                            {
                                name: 'Mon profil',
                                to: '/users/me',
                            },
                        ],
                    },
                    {
                        name: 'Suivez-nous !',
                        links: [
                            {
                                name: 'Instagram',
                                href: 'https://instagram.com/horizon.efrei',
                            },
                            {
                                name: 'Discord',
                                href: 'https://discord.gg/q22FW5xhvP',
                            },
                            {
                                name: 'Newsletter',
                                href: '',
                            },
                        ],
                    },
                    {
                        name: 'Horizon',
                        links: [
                            {
                                name: "L'équipe Horizon",
                                to: '/about',
                            },
                            {
                                name: 'Prochaines MàJ',
                                href: '/next',
                            },
                            {
                                name: 'FAQ / Discussions',
                                href: '/tags/horizon',
                            },
                        ],
                    },
                ],
            }
        },
    }
</script>

<style lang="scss">
    @import '@/assets/scss/abstracts/mixins/get-animation';

    .text-gradient-gold {
        @include get-text-animation(linear-gradient(-60deg, #ffd700, #e6be8a));
    }
</style>
