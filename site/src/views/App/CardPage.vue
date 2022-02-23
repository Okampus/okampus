<template>
    <AppView>
        <div
            class="flex relative flex-col mt-8 space-y-4 min-h-[9.5rem] rounded md:mx-auto md:mt-12 md:w-11/12 md:rounded-lg card bg-content"
        >
            <slot />
        </div>
    </AppView>
</template>

<script setup>
    import AppView from './AppView.vue'
</script>
