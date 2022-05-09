<template>
    <Suspense>
        <ProfileSocialsAsync></ProfileSocialsAsync>
        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import ProfileSocialsAsync from './ProfileSocialsAsync.vue'
</script>
