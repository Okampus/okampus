<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <ProfileClubAsync />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ProfileClubAsync from '@/views/Profile/ProfileClubAsync.vue'
</script>
