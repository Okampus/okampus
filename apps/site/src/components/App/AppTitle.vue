<template>
    <div class="text-0 ml-1 flex items-center gap-2 text-lg">
        <i :class="`text-3 ${icon} w-10 h-10 flex justify-center items-center`" />
        <div class="text-xl font-bold">{{ title }}</div>
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
