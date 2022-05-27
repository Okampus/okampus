<template>
    <Suspense>
        <ProfileManageClubAsync />
        <template #fallback>
            <AppLoader />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ProfileManageClubAsync from '@/views/Profile/ProfileManageClubAsync.vue'
</script>
