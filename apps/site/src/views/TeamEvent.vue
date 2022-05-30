<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <TeamEventAsync />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import TeamEventAsync from '@/views/TeamEventAsync.vue'
</script>
