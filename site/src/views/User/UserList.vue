<template>
    <div class="m-0 text-2">
        <div class="absolute top-0 left-0 py-12 m-0 w-full h-52 hero">
            <h3 class="mb-8 text-4xl font-bold text-0" style="padding-left: 5%; padding-right: 5%">
                Liste des utilisateurs
            </h3>
        </div>
        <div class="relative p-0 mt-32 mb-10 height text-0">
            <div v-for="user in users" :key="user" class="mx-auto mb-4 w-full md:w-9/12">
                <ProfileCard :user="user" />
            </div>
        </div>
    </div>
</template>

<script>
import ProfileCard from '@/components/App/Card/ProfileCard.vue'
export default {
    components: { ProfileCard },
    computed: {
        users() {
            return this.$store.state.users.users
        },
    },
    mounted() {
        this.$store.dispatch('users/getUsers')
    },
}
</script>
