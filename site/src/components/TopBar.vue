<template>
    <nav
        id="topbar"
        class="bg-0 flex fixed top-0 left-0 w-full h-topbar text-1 items-center justify-between border-b
    topbar-shadow"
    >
        <div class="flex flex-shrink-0 px-4 w-sidebar items-center justify-center">
            <button
                aria-label="Open Menu"
                @click="$emit('toggle-side-bar')"
            >
                <i class="ri-menu-line text-2xl" />
            </button>
            <div class="hidden 2xl:block brand w-32 h-6 ml-4" />
        </div>

        <div class="relative bg-transparent flex-grow mx-6">
            <bottom-border-input
                class="md:text-lg lg:text-xl"
                input-placeholder="Rechercher une ressource sur Horizon Efrei..."
            >
                <i
                    class="ri-file-search-line mouse-icon text-2xl"
                />
            </bottom-border-input>
        </div>

        <div
            v-if="!loggedIn"
            class="flex-shrink-0 flex justify-center items-center mr-4"
        >
            <button
                class="button"
                @click="$emit('toggle-login')"
            >
                <div class="flex items-center">
                    <p class="text-md hidden md:block mr-2">
                        SE CONNECTER
                    </p>
                    <i class="ri-login-circle-line text-xl" />
                </div>
            </button>
        </div>

        <div
            v-else
            class="flex bg-transparent items-center justify-between h-full"
        >
            <div class="mr-4">
                <user-card
                    :username="user.username"
                    :email="user.email"
                />
            </div>
        </div>
    </nav>
</template>

<script>

import UserCard from '@/components/Card/UserCard.vue'
import BottomBorderInput from '@/components/Input/BottomBorderInput.vue'

export default {
    components: {
        UserCard,
        BottomBorderInput
    },
    emits: [
        'toggle-side-bar',
        'toggle-login'
    ],
    computed: {
        loggedIn () {
            return this.$store.state.auth.status.loggedIn
        },
        user () {
            return this.$store.state.auth.user
        }
    }
}
</script>

<style lang="scss">
.topbar-shadow {
  box-shadow: 0 0 15px 3px rgba(0,0,0,0.05);
  clip-path: inset(0px 0px -30px 0px);
  :root.dark & {
    box-shadow: 0 0 20px 5px rgba(0,0,0,0.4);
  }
}
</style>
