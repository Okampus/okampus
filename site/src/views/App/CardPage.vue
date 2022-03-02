<template>
    <AppView>
        <div class="flex flex-col gap-4 rounded md:rounded-lg card bg-content">
            <slot />
        </div>
    </AppView>
</template>

<script setup>
    import AppView from './AppView.vue'
</script>
