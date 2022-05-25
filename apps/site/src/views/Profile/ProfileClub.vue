<template>
    <Suspense>
        <ProfileClubAsync />
        <template #fallback>
            <AppLoader />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ProfileClubAsync from '@/views/Profile/ProfileClubAsync.vue'
</script>
