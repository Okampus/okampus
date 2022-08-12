<template>
    <div class="ml-1 flex items-center gap-2">
        <i v-if="icon" class="flex w-8 items-center justify-center text-sm" :class="icon" />
        <div class="text-lg font-semibold">{{ title }}</div>
    </div>
</template>

<script setup>
    defineProps({
        icon: {
            type: String,
            default: null,
        },
        title: {
            type: String,
            required: true,
        },
    })
</script>
