<template>
    <Suspense>
        <UserProfileAsync></UserProfileAsync>
        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import UserProfileAsync from './UserProfileAsync.vue'
</script>
