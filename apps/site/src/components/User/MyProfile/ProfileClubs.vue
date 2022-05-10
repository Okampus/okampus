<template>
    <Suspense>
        <ProfileClubsAsync></ProfileClubsAsync>
        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ProfileClubsAsync from './ProfileClubAsync.vue'
</script>
