<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <DashBoardOverviewAsync />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import DashBoardOverviewAsync from './DashboardOverviewAsync.vue'
</script>
