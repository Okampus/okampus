<template>
    <div class="m-0 text-2">
        <div class="m-0 absolute py-12 hero h-52 w-full top-0 left-0">
            <h3
                class="text-4xl font-bold mb-8 text-0"
                style="padding-left: 5%; padding-right: 5%"
            >
                Liste des utilisateurs
            </h3>
        </div>
        <div
            class="
        height
        relative
        mt-32
        mb-10
        text-0
        p-0
      "
        >
            <div
                v-for="user in users"
                :key="user"
                class="
                    mb-4
                    mx-auto
                    md:w-9/12
                    w-full
                    "
            >
                <ProfileCard :user="user" />
            </div>
        </div>
    </div>
</template>
<script>
import ProfileCard from '@/components/Card/ProfileCard.vue';
export default {
    components: { ProfileCard },
    computed: {
        users() {
            return this.$store.state.users.users
        }
    },
    mounted() {
        this.$store.dispatch('users/getUsers')
    }

}
</script>
<style lang="">

</style>
