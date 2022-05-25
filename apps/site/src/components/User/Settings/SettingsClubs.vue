<template>
    <Suspense>
        <SettingsClubsAsync />
        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import SettingsClubsAsync from './SettingsClubsAsync.vue'
</script>
