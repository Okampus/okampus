<template>
    <Suspense>
        <ClubViewAsync></ClubViewAsync>
        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ClubViewAsync from './ClubViewAsync.vue'
</script>
