<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <DashboardClubsAsync />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import DashboardClubsAsync from './DashboardClubsAsync.vue'
</script>
