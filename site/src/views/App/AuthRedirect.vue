<template>
    <AppLoader />
</template>

<script>
    import AppLoader from '@/components/App/AppLoader.vue'
    import router from '@/router'
    export default {
        components: {
            AppLoader,
        },
        created() {
            this.$store.dispatch('auth/getMe').then(() => router.push('/'))
        },
    }
</script>
