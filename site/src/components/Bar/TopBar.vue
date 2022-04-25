<template>
    <nav class="flex fixed top-0 left-0 justify-between items-center w-full topbar h-topbar text-1">
        <div class="flex items-center w-sidebar-lg">
            <div class="flex shrink-0 justify-center w-sidebar-sm">
                <button aria-label="Open Menu" @click="$emit('toggle-side-bar')">
                    <i class="text-2xl text-white fas fa-bars" />
                </button>
            </div>
            <AppLogo only="dark" />
        </div>

        <div class="relative grow mx-6 bg-transparent">
            <SearchBar />
        </div>

        <div v-if="!auth.loggedIn" class="flex shrink-0 justify-center items-center mr-4">
            <button class="button" @click="emitter.emit('login')">
                <div class="flex items-center">
                    <p class="mr-2 font-semibold uppercase text-md">Se connecter</p>
                    <i class="text-lg fas fa-sign-in-alt" />
                </div>
            </button>
        </div>

        <div v-else class="flex justify-between items-center h-full bg-transparent">
            <div class="mr-4">
                <UserAvatar :img-src="auth.user.avatar" :username="auth.user.fullname" />
            </div>
        </div>
    </nav>
</template>

<script setup>
    // import UserCard from '@/components/App/Card/UserCard.vue'
    import UserAvatar from '@/components/User/UserAvatar.vue'
    import SearchBar from '@/components/Bar/SearchBar.vue'
    import AppLogo from '@/components/App/AppLogo.vue'

    import { emitter } from '@/shared/modules/emitter'
    import { useAuthStore } from '@/store/auth.store'

    const auth = useAuthStore()

    defineEmits(['toggle-side-bar'])
</script>
