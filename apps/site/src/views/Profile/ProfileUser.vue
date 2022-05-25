<template>
    <Suspense>
        <ProfileUserAsync />
        <template #fallback>
            <AppLoader />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ProfileUserAsync from '@/views/Profile/ProfileUserAsync.vue'
</script>
