<template>
    <footer class="flex flex-col gap-6 py-5 xs:mx-20 sm:mx-auto xs-max:mx-10">
        <div class="flex flex-col items-center sm:gap-6 xl:flex-row xl:gap-14">
            <div class="flex flex-col gap-6 sm-max:w-full">
                <!-- Logo Separator -->
                <AppLogo class="ml-3" />

                <div
                    class="flex flex-col-reverse gap-6 mx-4 lg:flex-row lg:gap-16 sm-max:flex-row sm-max:gap-14"
                >
                    <!-- Contact Us -->
                    <div class="flex gap-4 mt-1 text-1">
                        <div
                            class="flex flex-row justify-between sm:gap-2.5 sm:items-center sm:mx-16 sm:w-full lg:flex-col lg:mx-0 lg:w-fit sm-max:flex-col sm-max:mb-10 sm-max:ml-2"
                        >
                            <a
                                v-for="(link, i) in contactLinks"
                                :key="i"
                                class="flex text-3xl lg:h-5 lg:text-xl flex-start"
                                :href="link.href"
                            >
                                <font-awesome-icon :icon="link.icon" :class="link.iconClasses ?? ''" />
                            </a>
                        </div>
                        <div class="hidden flex-col gap-2.5 lg:flex">
                            <a
                                v-for="(link, i) in contactLinks"
                                :key="i"
                                :href="link.href"
                                target="_blank"
                                class="h-5 text-base link"
                                >{{ link.label }}</a
                            >
                        </div>
                    </div>

                    <!-- Sections -->
                    <div
                        class="flex flex-wrap items-center sm:flex-row sm:gap-16 sm:items-start sm-max:w-full"
                    >
                        <div
                            v-for="(section, i) in sections"
                            :key="i"
                            class="sm-max:mb-10 sm-max:w-1/2 text-0"
                        >
                            <h5 class="mb-2 text-base tracking-wider uppercase text-4">
                                {{ section.name }}
                            </h5>
                            <div class="flex flex-col gap-1">
                                <div v-for="(link, j) in section.links" :key="j">
                                    <AppLink :link="link" class="text-base link" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Discord Invite Previews -->
            <div class="flex flex-col gap-2 w-full lg:flex-row lg:w-fit xl:flex-col">
                <GuildPreviewCard
                    v-for="(server, i) in discordServers"
                    :key="i"
                    :="discordData[server.key]"
                    class="hidden lg:flex"
                />
                <GuildPreviewCard
                    v-for="(server, i) in discordServers"
                    :key="i"
                    class="hidden lg-max:flex"
                    :="{ ...discordData[server.key], mini: false }"
                />
            </div>
        </div>

        <!-- Copyright -->
        <div class="flex gap-2 justify-center items-center text-0">
            <div class="flex flex-col gap-1.5 items-center xs:flex-row">
                <p>Made with</p>
                <div class="flex gap-1.5">
                    <a class="text-xl" href="https://v3.vuejs.org/"
                        ><font-awesome-icon :icon="['fab', 'vuejs']"
                    /></a>
                    <p>and</p>
                    <p class="text-xl">❤️</p>
                </div>
                <p>by Horizon</p>
                <div class="flex gap-1">
                    <p><font-awesome-icon class="text-sm" :icon="['far', 'copyright']" /></p>
                    <p>{{ new Date().getFullYear() }}</p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
    import axios from 'axios'
    import AppLink from '../App/AppLink.vue'
    import AppLogo from '../App/AppLogo.vue'
    import GuildPreviewCard from '../App/Card/GuildPreviewCard.vue'
    export default {
        components: { AppLink, AppLogo, GuildPreviewCard },
        props: {
            discordServers: {
                type: Array,
                default: () => [
                    {
                        key: 'efreussite',
                        id: '694220883815956580',
                        iconUrl:
                            'https://cdn.discordapp.com/icons/694220883815956580/a_aaf0ceaa61a5cbe3f2bc9b809a16d95a.png',
                        tagLine: 'Entraide / Partage',
                        invite: 'https://discord.gg/BVbZPYfBGW',
                    },
                    {
                        key: 'web',
                        id: '900796015915978772',
                        iconUrl:
                            'https://cdn.discordapp.com/icons/900796015915978772/76c5153e25f71124a1a199ce7dd5a749.png',
                        tagLine: 'Dév. Web Open Source',
                        invite: 'https://discord.gg/VDQekzJgVp',
                    },
                    {
                        key: 'mentorat',
                        id: '844294010628472834',
                        iconUrl:
                            'https://cdn.discordapp.com/icons/844294010628472834/8f3fbef07829e6737e71aa792dcca7df.png',
                        tagLine: 'Mentorat / Formation',
                        invite: 'https://discord.gg/G7fWxQZXqF',
                    },
                ],
            },
        },
        data() {
            return {
                discordData: {},
                contactLinks: [
                    {
                        label: 'dev@horizon-efrei.fr',
                        href: "mailto:dev@horizon-efrei.fr?subject=Contact%20via%20site%20-%20%5BRAISON%20DE%20CONTACT%5D&body=Bonjour%20%C3%A0%20l'%C3%A9quipe%20de%20d%C3%A9veloppement%20Horizon%20!%0D%0A%0D%0AJe%20suis%20%5BR%C3%94LE%20AU%20SEIN%20DE%20L'EFREI%5D%2C%20et%20je%20vous%20contact%20au%20sujet%20de%20%5BSUJET%5D%0D%0A%0D%0ACordialement%2C",
                        icon: ['far', 'envelope'],
                    },
                    {
                        label: 'horizon-efrei',
                        href: 'https://github.com/horizon-efrei',
                        icon: ['fab', 'github'],
                    },
                    {
                        label: '@horizon.efrei',
                        href: 'https://instagram.com/horizon.efrei',
                        icon: ['fab', 'instagram'],
                    },
                    {
                        label: 'Horizon EFREI',
                        href: 'https://linkedin.com/company/horizon-efrei/',
                        icon: ['fab', 'linkedin'],
                    },
                ],
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
                        name: 'Support',
                        links: [
                            {
                                name: 'Support',
                                to: '/support',
                            },
                            {
                                name: 'FAQ Horizon',
                                to: '/tags/meta',
                            },
                            {
                                name: 'Signaler un Bug',
                                to: '/report-bug',
                            },
                        ],
                    },
                    {
                        name: 'Technique',
                        links: [
                            {
                                name: 'Docs API',
                                href: 'https://api.horizon-efrei.fr/docs/',
                            },
                            {
                                name: 'Infos Site',
                                href: 'https://github.com/horizon-efrei/HorizonWeb/blob/master/README.md',
                            },
                            {
                                name: 'Contribuer',
                                href: 'https://github.com/horizon-efrei/HorizonWeb/blob/master/CONTRIBUTING.md',
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
                                name: 'Discussion',
                                href: '/tags/horizon',
                            },
                        ],
                    },
                ],
            }
        },
        mounted() {
            this.discordServers.forEach((server) => {
                axios.get(`https://discordapp.com/api/guilds/${server.id}/widget.json`).then(({ data }) => {
                    const { name, presence_count, instant_invite } = data
                    this.discordData[server.key] = {
                        name,
                        presence: presence_count,
                        inviteUrl: server.invite ?? instant_invite,
                        iconUrl: server.iconUrl,
                        tagLine: server.tagLine,
                    }
                })
            })
        },
    }
</script>
