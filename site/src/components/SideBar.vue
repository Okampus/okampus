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
        class="overflow-hidden flex flex-col flex-shrink-0 w-sidebar bg-1
    border-r border-bar whitespace-nowrap transition-spacing z-30"
    >
        <div
            v-if="uncollapsed"
            id="slide-sidebar-top"
            class="bg-0 h-topbar flex flex-shrink-0 items-center justify-center"
        >
            <button
                aria-label="Open Menu"
                @click="$emit('close-side-bar')"
            >
                <i class="ri-close-line text-4xl text-0" />
            </button>
        </div>

        <div
            class="overflow-y-auto overflow-x-hidden app-scrollbar-on-hover"
            :class="{ 'overflow-y-hidden': collapsing }"
        >
            <div class="divide-y">
                <div class="divide-y 2xl:divide-y-0">
                    <ul
                        v-for="[sectionName, sectionLinks] in Object.entries(links)"
                        :key="sectionName"
                        class="p-2"
                    >
                        <p class="hidden 2xl:block text-5 uppercase py-2 pl-4">
                            {{ sectionName }}
                        </p>
                        <template
                            v-for="link of sectionLinks"
                            :key="link"
                        >
                            <li>
                                <router-link
                                    :to="link.to"
                                    class="
                                            py-1
                                            my-1
                                            flex
                                            w-11/12
                                            items-center
                                            horizontal-tab
                                            cursor-pointer
                                            opacity-80
                                            mx-auto
                                            text-0
                                        "
                                    :class="{ active: link.to === $route.path }"
                                >
                                    <div
                                        class="
                                            flex flex-col
                                            2xl:flex-row 2xl:space-x-4 2xl:ml-5
                                            items-center
                                            w-full
                                            mb-1
                                        "
                                    >
                                        <i
                                            :class="link.icon"
                                            class="flex-shrink-0 text-xl"
                                        />
                                        <span>{{ link.text }}</span>
                                    </div>
                                </router-link>
                            </li>
                        </template>
                    </ul>
                </div>
                <div
                    class="flex px-2 py-4 space-x-4 items-center justify-center flex-wrap"
                >
                    <p class="text-1 text-bold">
                        Mode Sombre
                    </p>
                    <switch-input
                        v-model="theme"
                        @click="$store.dispatch('userConfig/switchTheme')"
                    />
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
            default: true
        },
        uncollapsed: {
            type: Boolean,
            default: true
        },
        collapsing: {
            type: Boolean,
            default: true
        }
    },
    emits: [
        'close-side-bar'
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
                        { to: '/test', text: 'Page Test', icon: 'ri-test-tube-line' }
                    ],
                }),
                ...({
                    forum: [
                        { to: '/', text: 'Accueil', icon: 'ri-home-3-line' },
                        // TODO: { to: '/info', text: 'Annonces', icon: 'ri-alarm-warning-line' },
                        { to: '/admin', text: 'Admin', icon: 'ri-pie-chart-box-line' }
                    ],
                    'docs sharing': [
                        { to: '/docs', text: 'Documents', icon: 'ri-folder-line' },
                        { to: '/docs/upload', text: 'Uploader', icon: 'ri-folder-upload-line' }
                    ],
                    blog:[
                        { to: '/blog', text: 'Blog', icon: 'ri-book-open-line' },
                        { to: '/blog/new', text: 'Écrire un article', icon: 'ri-quill-pen-line' },
                        // { to: '/blog/admin', text: 'Admin (Blog)', icon: 'ri-pie-chart-box-line' }
                    ],
                    post: [
                        { to: '/posts/ask', text: 'Créer un Post', icon: 'ri-chat-new-line' },
                        { to: '/posts', text: 'Tous les Posts', icon: 'ri-chat-check-line' }
                    ],
                }),
                ...(this.loggedIn
                    ? {
                        'communauté': [
                            { to: '/users/', text: 'Utilisateurs', icon: 'ri-user-search-line' },
                            { to: '/users/me', text: 'Mon compte', icon: 'ri-account-box-line' },
                            { to: '/users/me/favorites', text: 'Mes favoris', icon: 'ri-star-fill' },
                        ]
                    }
                    : {
                        'communauté': [
                            { to: '/users/', text: 'Utilisateurs', icon: 'ri-user-search-line' },
                        ]
                    })
            })
        }
    }
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
