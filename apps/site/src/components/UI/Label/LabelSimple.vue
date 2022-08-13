<template>
    <span
        class="w-fit cursor-pointer rounded-md py-0.5 px-2 line-clamp-1"
        :class="[textClass, bgClass]"
        @click="action"
    >
        <slot />
    </span>
</template>

<script setup>
    defineProps({
        textClass: {
            type: [String, Array, Object],
            default: 'text-white text-sm font-semibold',
        },
        bgClass: {
            type: [String, Array, Object],
            default: 'bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400',
        },
        action: {
            type: Function,
            default: () => {},
        },
    })
</script>
