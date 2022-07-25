<template>
    <nav class="topbar h-topbar text-1 fixed top-0 left-0 z-50 flex w-full items-center justify-between">
        <div class="w-sidebar-lg flex items-center">
            <div class="w-sidebar-sm flex shrink-0 justify-center">
                <button aria-label="Open Menu" @click="$emit('toggle-side-bar')">
                    <i class="fas fa-bars text-2xl text-white" />
                </button>
            </div>
            <AppLogo only="dark" />
        </div>

        <div class="relative mx-6 grow bg-transparent">
            <LayoutSearch />
        </div>

        <template v-if="!isHome || auth.loggedIn">
            <div v-if="!auth.loggedIn" class="mr-4 flex shrink-0 items-center justify-center">
                <ButtonLogin />
            </div>

            <div v-else class="mr-4 flex h-full items-center justify-between bg-transparent">
                <!-- TODO: on small screen, use full screen modal -->
                <Popper offset-distance="6" offset-skid="-85">
                    <ProfileAvatar
                        class="cursor-pointer"
                        :avatar="auth.user.avatar"
                        :name="fullname(auth.user)"
                    />
                    <template #content="{ close }">
                        <div
                            class="text-1 flex w-64 flex-col gap-2 rounded-b-lg bg-white pb-2 opacity-[0.96] shadow-md dark:bg-gray-800"
                        >
                            <div class="flex gap-3 px-4 pt-4">
                                <ProfileAvatar :avatar="auth.user.avatar" :name="fullname(auth.user)" />
                                <div class="w-[calc(100%-5rem)]">
                                    <div class="overflow-hidden text-ellipsis font-bold">
                                        {{ fullname(auth.user) }}
                                    </div>
                                    <div class="overflow-hidden text-ellipsis">{{ auth.user.email }}</div>
                                </div>
                            </div>

                            <hr class="mt-2 h-[1px] w-11/12 self-center border-none bg-gray-500/20" />
                            <router-link
                                class="topbar-popup-item"
                                :to="`/user/${auth.user.id}`"
                                @click="close"
                            >
                                <i class="fas fa-user" />
                                <div>Mon profil</div>
                            </router-link>

                            <router-link class="topbar-popup-item" to="/me" @click="close">
                                <i class="fas fa-gear" />
                                <div>Paramètres</div>
                            </router-link>

                            <router-link class="topbar-popup-item" to="/rgpd" @click="close">
                                <i class="fas fa-database" />
                                <div>Mes données (RGPD)</div>
                            </router-link>

                            <div class="topbar-popup-item" @click="emitter.emit('logout')">
                                <i class="fas fa-arrow-right-from-bracket" />
                                <div>Déconnexion</div>
                            </div>
                        </div>
                    </template>
                </Popper>
            </div>
        </template>
    </nav>
</template>

<script setup>
    import Popper from 'vue3-popper'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ButtonLogin from '@/components/UI/Button/ButtonLogin.vue'
    import LayoutSearch from '@/components/Layout/LayoutSearch.vue'
    import AppLogo from '@/components/App/AppLogo.vue'

    import { emitter } from '@/shared/modules/emitter'
    import { useAuthStore } from '@/store/auth.store'
    import { useRoute } from 'vue-router'

    import { fullname } from '@/utils/users'
    import { getCurrentPath } from '@/utils/routeUtils'
    import { computed } from 'vue'

    const auth = useAuthStore()
    const route = useRoute()

    const isHome = computed(() => route.name === 'home' || getCurrentPath() === '/')

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
