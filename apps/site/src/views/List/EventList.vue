<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <EventListAsync />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import EventListAsync from '@/views/List/EventListAsync.vue'
</script>
