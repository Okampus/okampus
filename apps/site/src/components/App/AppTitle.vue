<template>
    <div class="text-0 flex items-center gap-3 text-lg">
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
