<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <DashboardReportAsync />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import DashboardReportAsync from './DashboardReportAsync.vue'
</script>
