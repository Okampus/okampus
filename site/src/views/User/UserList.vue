<template>
    <ListPage>
        <div v-for="user in users" :key="user">
            <ProfileCard :user="user" />
        </div>
    </ListPage>
</template>

<script>
    import ProfileCard from '@/components/App/Card/ProfileCard.vue'
    import ListPage from '../App/ListPage.vue'
    export default {
        components: { ProfileCard, ListPage },
        computed: {
            users() {
                return this.$store.getters['profiles/getUsers']
            },
        },
        mounted() {
            this.$store.dispatch('profiles/getUsers')
        },
    }
</script>
