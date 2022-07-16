<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense timeout="0">
            <template #default>
                <slot v-bind="props" />
            </template>
            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    defineProps({ props: { type: Object, default: () => ({}) } })
</script>
