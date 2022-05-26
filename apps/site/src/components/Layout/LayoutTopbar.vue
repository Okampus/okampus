<template>
    <nav class="flex fixed top-0 left-0 z-20 justify-between items-center w-full topbar h-topbar text-1">
        <div class="flex items-center w-sidebar-lg">
            <div class="flex shrink-0 justify-center w-sidebar-sm">
                <button aria-label="Open Menu" @click="$emit('toggle-side-bar')">
                    <i class="text-2xl text-white fas fa-bars" />
                </button>
            </div>
            <AppLogo />
        </div>

        <div class="relative grow mx-6 bg-transparent">
            <LayoutSearch />
        </div>

        <template v-if="route.name !== 'home' || auth.loggedIn">
            <div v-if="!auth.loggedIn" class="flex shrink-0 justify-center items-center mr-4">
                <ButtonLogin />
            </div>

            <div v-else class="flex justify-between items-center mr-4 h-full bg-transparent">
                <div class="mr-4">
                    <!-- TODO: on small screen, use full screen modal -->
                    <Popper offset-distance="6" offset-skid="-80">
                        <ProfileAvatar
                            class="cursor-pointer"
                            :avatar="auth.user.avatar"
                            :name="fullname(auth.user)"
                        />
                        <template #content>
                            <div
                                class="flex flex-col gap-2 pb-2 w-64 bg-white/95 dark:bg-gray-800/95 rounded-b-lg shadow-md"
                            >
                                <div class="flex gap-3 px-4 pt-4">
                                    <ProfileAvatar :avatar="auth.user.avatar" :name="fullname(auth.user)" />
                                    <div class="w-[calc(100%-5rem)]">
                                        <div class="overflow-hidden font-bold text-ellipsis">
                                            {{ fullname(auth.user) }}
                                        </div>
                                        <div class="overflow-hidden text-ellipsis">{{ auth.user.email }}</div>
                                    </div>
                                </div>

                                <hr class="self-center mt-2 w-11/12 h-[1px] bg-gray-500/20 border-none" />
                                <router-link
                                    class="flex gap-6 items-center py-2 px-4 hover:bg-gray-200/95 hover:dark:bg-gray-600/95 cursor-pointer"
                                    to="/me"
                                >
                                    <i class="text-xl fa-solid fa-user" />
                                    <div>Mon profil</div>
                                </router-link>
                                <div
                                    class="flex gap-6 items-center py-2 px-4 hover:bg-gray-200/95 hover:dark:bg-gray-600/95 cursor-pointer"
                                    @click="emitter.emit('logout')"
                                >
                                    <i class="text-xl fa-solid fa-arrow-right-from-bracket" />
                                    <div>Déconnexion</div>
                                </div>
                            </div>
                        </template>
                    </Popper>
                </div>
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

    const auth = useAuthStore()
    const route = useRoute()

    defineEmits(['toggle-side-bar'])
</script>
