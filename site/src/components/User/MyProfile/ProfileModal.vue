<template>
    <Suspense>
        <ProfileModalAsync></ProfileModalAsync>
        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ProfileModalAsync from './ProfileModalAsync.vue'
</script>
