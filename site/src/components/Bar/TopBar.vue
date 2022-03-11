<template>
    <nav
        class="flex fixed top-0 left-0 justify-between items-center w-full border-b border-navbar bg-navbar h-topbar text-1 topbar-shadow"
    >
        <div class="flex items-center w-sidebar-lg">
            <div class="flex shrink-0 justify-center w-sidebar-sm">
                <button aria-label="Open Menu" @click="$emit('toggle-side-bar')">
                    <i class="text-2xl fas fa-bars text-0" />
                </button>
            </div>
            <AppLogo />
        </div>

        <div class="relative grow mx-6 bg-transparent">
            <SearchBar />
        </div>

        <div v-if="!auth.loggedIn" class="flex shrink-0 justify-center items-center mr-4">
            <button class="button" @click="emitter.emit('login')">
                <div class="flex items-center">
                    <p class="mr-2 uppercase text-md">Se connecter</p>
                    <i class="text-lg fas fa-sign-in-alt" />
                </div>
            </button>
        </div>

        <div v-else class="flex justify-between items-center h-full bg-transparent">
            <div class="mr-4">
                <UserCard :user="auth.user" />
            </div>
        </div>
    </nav>
</template>

<script setup>
    import UserCard from '@/components/App/Card/UserCard.vue'
    import SearchBar from '@/components/Bar/SearchBar.vue'
    import AppLogo from '@/components/App/AppLogo.vue'

    import { emitter } from '@/shared/modules/emitter'
    import { useAuthStore } from '@/store/auth.store'

    const auth = useAuthStore()

    defineEmits(['toggle-side-bar'])
</script>

<style lang="scss">
    .topbar-shadow {
        clip-path: inset(0 0 -30px 0);
        box-shadow: 0 0 15px 3px rgb(0 0 0 / 5%);

        .dark & {
            box-shadow: 0 0 20px 5px rgb(0 0 0 / 40%);
        }
    }
</style>
