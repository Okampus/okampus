<template>
    <Suspense>
        <TeamEventAsync />
        <template #fallback>
            <AppLoader />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import TeamEventAsync from '@/views/TeamEventAsync.vue'
</script>
