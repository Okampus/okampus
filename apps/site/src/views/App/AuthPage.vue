<template>
    <AppLoader />
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import { useAuthStore } from '@/store/auth.store'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    useAuthStore()
        .getMe()
        .then(() => router.push('/'))
</script>
