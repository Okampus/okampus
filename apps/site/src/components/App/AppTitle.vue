<template>
    <div class="flex gap-3 items-center text-lg text-0">
        <i :class="`text-3 ${icon} w-6`" />
        <div class="font-bold">{{ title }}</div>
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
