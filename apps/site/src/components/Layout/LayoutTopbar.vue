<template>
    <nav
        class="h-topbar text-1 fixed top-0 left-0 z-30 flex w-full items-center"
        :class="localStore.me?.finishedOnboarding ? 'justify-between topbar' : 'justify-center bg-0'"
    >
        <div class="flex shrink-0 items-center gap-2">
            <div v-if="localStore.me?.finishedOnboarding" class="w-sidebar-lg flex items-center">
                <div class="w-sidebar-sm flex shrink-0 justify-center">
                    <button aria-label="Open Menu" @click="$emit('toggle-side-bar')">
                        <i class="fas fa-bars text-2xl text-white" />
                    </button>
                </div>
                <AppLogo only="dark" />
            </div>
            <LabelSimple v-if="localStore.me?.finishedOnboarding" class="mr-4 !px-1.5">Beta</LabelSimple>
            <div v-else class="ml-20 flex items-center gap-6">
                <AppLogo :="localStore.me?.finishedOnboarding ? { only: 'dark' } : {}" class="mt-1.5" />
                <DarkModeInput />
            </div>
        </div>

        <template v-if="!isHome || localStore.loggedIn">
            <div v-if="!localStore.loggedIn" class="ml-10 flex shrink-0 items-center justify-center">
                <ButtonLogin />
            </div>

            <div
                v-else-if="localStore.me?.finishedOnboarding"
                class="mr-4 flex h-full w-full items-center justify-between bg-transparent"
            >
                <div class="relative mr-6 grow bg-transparent">
                    <LayoutSearch />
                </div>
                <div id="notification-bell" class="fa fa-bell mr-6 cursor-pointer text-xl text-gray-200" />
                <!-- TODO: on small screen, use full screen modal -->
                <Dropdown theme="profile-dropdown">
                    <ProfileAvatar
                        class="cursor-pointer"
                        :avatar="localStore.me.avatar"
                        :name="fullname(localStore.me)"
                    />
                    <template #popper="{ hide }">
                        <div
                            class="text-1 flex w-64 flex-col gap-2 rounded-b-lg bg-white pb-2 opacity-[0.96] shadow-md dark:bg-gray-800"
                        >
                            <div class="flex gap-3 px-4 pt-4">
                                <ProfileAvatar
                                    :avatar="localStore.me.avatar"
                                    :name="fullname(localStore.me)"
                                />
                                <div class="w-[calc(100%-5rem)]">
                                    <div class="overflow-hidden text-ellipsis font-bold">
                                        {{ fullname(localStore.me) }}
                                    </div>
                                    <router-link
                                        :to="`/user/${localStore.me.id}`"
                                        class="link-blue"
                                        @click="hide"
                                        >Profil public</router-link
                                    >
                                </div>
                            </div>

                            <hr class="mt-2 h-[1px] w-11/12 self-center border-none bg-gray-500/20" />
                            <router-link class="topbar-popup-item" :to="`/me`" @click="hide">
                                <i class="fas fa-gear" />
                                <div>Gérer mon profil</div>
                            </router-link>

                            <router-link class="topbar-popup-item" to="/rgpd" @click="hide">
                                <i class="fas fa-database" />
                                <div>Gérer mes données</div>
                            </router-link>

                            <div class="topbar-popup-item" @click="emitter.emit('logout')">
                                <i class="fas fa-arrow-right-from-bracket" />
                                <div>Déconnexion</div>
                            </div>
                        </div>
                    </template>
                </Dropdown>
            </div>
        </template>
    </nav>
</template>

<script setup>
    import { Dropdown } from 'floating-vue'

    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'
    import DarkModeInput from '@/components/Input/DarkModeInput.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ButtonLogin from '@/components/UI/Button/ButtonLogin.vue'
    import LayoutSearch from '@/components/Layout/LayoutSearch.vue'
    import AppLogo from '@/components/App/AppLogo.vue'

    import { emitter } from '@/shared/modules/emitter'
    import { useRoute } from 'vue-router'

    import { fullname } from '@/utils/users'
    import { getCurrentPath } from '@/utils/routeUtils'

    import { computed } from 'vue'

    import localStore from '@/store/local.store'

    const route = useRoute()

    const isHome = computed(() => route.name === 'home' || getCurrentPath() === '/')

    ;(function (n, o, t, i, f) {
        n[i] = {}
        var m = ['init']
        n[i]._c = []
        m.forEach(
            (me) =>
                (n[i][me] = function () {
                    n[i]._c.push([me, arguments])
                }),
        )
        var elt = o.createElement(f)
        elt.type = 'text/javascript'
        elt.async = true
        elt.src = t
        var before = o.getElementsByTagName(f)[0]
        before.parentNode.insertBefore(elt, before)
    })(window, document, 'https://embed.novu.co/embed.umd.min.js', 'novu', 'script')

    // eslint-disable-next-line no-undef
    novu.init('0Ww3rjlTtbJr', '#notification-bell', {
        subscriberId: localStore.value.me.id,
        email: localStore.value.me.email,
        firstName: localStore.value.me.firstname,
        lastName: localStore.value.me.lastname,
    })

    defineEmits(['toggle-side-bar'])
</script>

<style lang="scss">
    .topbar-popup-item {
        @apply flex gap-6 items-center py-2 px-4 hover:bg-gray-200 hover:dark:bg-gray-600 cursor-pointer;

        & i {
            @apply text-xl;
        }
    }
</style>
