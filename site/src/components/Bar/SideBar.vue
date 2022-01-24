<template>
    <aside
        id="sidebar"
        :class="{
            'hidden-sidebar': collapsed || collapsing,
            'sidebar-shadow': uncollapsed || !collapsed || collapsing,
            fixed: uncollapsed,
            'h-screen': uncollapsed,
            sticky: !uncollapsed,
            'after-topbar': !uncollapsed,
            'h-content': !uncollapsed,
        }"
        class="flex overflow-hidden z-30 flex-col shrink-0 whitespace-nowrap border-r w-sidebar bg-1 border-bar transition-spacing"
    >
        <div
            v-if="uncollapsed"
            id="slide-sidebar-top"
            class="flex shrink-0 justify-center items-center bg-0 h-topbar"
        >
            <button aria-label="Open Menu" @click="$emit('close-side-bar')">
                <font-awesome-icon icon="times" class="text-2xl text-0" />
            </button>
        </div>

        <div
            class="overflow-x-hidden overflow-y-auto app-scrollbar-on-hover"
            :class="{ 'overflow-y-hidden': collapsing }"
        >
            <div class="divide-y">
                <div class="divide-y 2xl:divide-y-0">
                    <ul
                        v-for="[sectionName, sectionLinks] in Object.entries(links)"
                        :key="sectionName"
                        class="py-2"
                    >
                        <p class="hidden pl-4 uppercase 2xl:block text-5">
                            {{ sectionName }}
                        </p>
                        <template v-for="link of sectionLinks" :key="link">
                            <li>
                                <router-link
                                    :to="link.to"
                                    class="flex items-center py-1 my-1 mx-auto w-11/12 opacity-80 cursor-pointer horizontal-tab text-0"
                                    :class="{ active: link.to === $route.path }"
                                >
                                    <div
                                        class="flex flex-col items-center mb-1 w-full 2xl:flex-row 2xl:ml-5 2xl:space-x-4"
                                    >
                                        <font-awesome-icon :icon="link.icon" class="shrink-0 text-xl" />

                                        <span>{{ link.text }}</span>
                                    </div>
                                </router-link>
                            </li>
                        </template>
                    </ul>
                </div>
                <div class="flex flex-wrap justify-center items-center py-4 px-2 space-x-4">
                    <p class="text-1 text-bold">Mode Sombre</p>
                    <SwitchInput v-model="theme" @click="$store.dispatch('userConfig/switchTheme')" />
                </div>
            </div>
        </div>
    </aside>
</template>

<script lang="js">
import SwitchInput from '@/components/Input/SwitchInput.vue'
export default {
    components: { SwitchInput },
    props: {
        collapsed: {
            type: Boolean,
            default: true,
        },
        uncollapsed: {
            type: Boolean,
            default: true,
        },
        collapsing: {
            type: Boolean,
            default: true,
        },
    },
    emits: [
        'close-side-bar',
    ],
    computed: {
        theme () {
            return this.$store.state.userConfig.theme === 'dark'
        },
        loggedIn () {
            return this.$store.state.auth.status.loggedIn ?? false
        },
        links() {
            return ({
                ...( import.meta.env.DEV && {
                    dev: [
                        {
                            to: '/test',
                            text: 'Page Test',
                            icon: 'vial',
                        },
                    ],
                }),

                ...({
                    admin: [
                        {
                            to: '/admin',
                            text: 'Dashboard',
                            icon: 'columns',
                        },
                    ],
                    forum: [
                        {
                            to: '/posts/new',
                            text: 'Créer un Post',
                            icon: 'question-circle',
                        },
                        {
                            to: '/posts',
                            text: 'Forum',
                            icon: 'comments',
                        },
                    ],
                    'horizon docs': [
                        {
                            to: '/docs',
                            text: 'Documents',
                            icon: 'folder',
                        },
                        {
                            to: '/docs/new',
                            text: 'Uploader',
                            icon: 'upload',
                        },
                    ],
                    blog: [
                        {
                            to: '/blog',
                            text: 'Pause Café',
                            icon: 'newspaper',
                        },
                        {
                            to: '/blog/new',
                            text: 'Écrire un article',
                            icon: 'pen-alt',
                        },
                        // { to: '/blog/admin', text: 'Admin (Blog)', icon: 'columns' }
                    ],
                }),

                ...(this.loggedIn
                    ? {
                        'communauté': [
                            {
                                to: '/users/',
                                text: 'Utilisateurs',
                                icon: 'users',
                            },
                            {
                                to: '/me/home',
                                text: 'Mon compte',
                                icon: 'user-cog',
                            },
                            {
                                to: '/me/favorites',
                                text: 'Mes favoris',
                                icon: 'crown',
                            },
                        ],
                    }
                    : {
                        'communauté': [
                            {
                                to: '/users/',
                                text: 'Utilisateurs',
                                icon: 'users',
                            },
                        ],
                    }),
            })
        },
    },
}
</script>

<style lang="scss">
.sidebar-shadow {
    box-shadow: 0 0 15px 3px rgba(0, 0, 0, 0.05);
    clip-path: inset(0px -30px 0px 0px);
    :root.dark & {
        box-shadow: 0 0px 20px 5px rgba(0, 0, 0, 0.4);
    }
}

.transition-spacing {
    transition: margin-left 300ms;
}
</style>
