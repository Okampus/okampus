<template>
    <Suspense>
        <SettingsModalAsync />
        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import SettingsModalAsync from './SettingsModalAsync.vue'
</script>
