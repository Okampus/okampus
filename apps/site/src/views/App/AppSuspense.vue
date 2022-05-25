<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense>
            <slot />
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
</script>
