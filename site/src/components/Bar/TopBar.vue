<template>
    <nav
        class="flex fixed top-0 left-0 justify-between items-center w-full border-b bg-0 h-topbar text-1 topbar-shadow"
    >
        <div class="flex items-center w-sidebar-lg">
            <div class="flex shrink-0 justify-center w-sidebar-sm">
                <button aria-label="Open Menu" @click="$emit('toggle-side-bar')">
                    <font-awesome-icon icon="bars" class="text-2xl text-0" />
                </button>
            </div>
            <div class="w-32 h-6 logo" @click="$router.push('/')" />
        </div>

        <div class="relative grow mx-6 bg-transparent">
            <SearchBar />
        </div>

        <div v-if="!loggedIn" class="flex shrink-0 justify-center items-center mr-4">
            <button class="button" @click="$emit('toggle-login')">
                <div class="flex items-center">
                    <p class="mr-2 uppercase text-md">Se connecter</p>
                    <font-awesome-icon icon="sign-in-alt" class="text-lg" />
                </div>
            </button>
        </div>

        <div v-else class="flex justify-between items-center h-full bg-transparent">
            <div class="mr-4">
                <UserCard :username="user.fullname" :email="user.email" :avatar="user.avatar" />
            </div>
        </div>
    </nav>
</template>

<script>
    import UserCard from '@/components/App/Card/UserCard.vue'
    import SearchBar from '@/components/Bar/SearchBar.vue'

    export default {
        components: {
            UserCard,
            SearchBar,
        },
        emits: ['toggle-side-bar', 'toggle-login'],
        data() {
            return { showSearchBar: false }
        },
        computed: {
            loggedIn() {
                return this.$store.state.auth.loggedIn
            },
            user() {
                return this.$store.state.auth.user
            },
        },
    }
</script>

<style lang="scss">
    .topbar-shadow {
        clip-path: inset(0 0 -30px 0);
        box-shadow: 0 0 15px 3px rgb(0 0 0 / 5%);

        :root.dark & {
            box-shadow: 0 0 20px 5px rgb(0 0 0 / 40%);
        }
    }
</style>
