<template>
    <Suspense>
        <SettingsSocialsAsync></SettingsSocialsAsync>
        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import SettingsSocialsAsync from './SettingsSocialsAsync.vue'
</script>
