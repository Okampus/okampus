<template>
    <i v-if="type === 'icon'" class="fas" :class="`fa-${emoji}`" />
    <div v-else class="text-0">
        {{ emoji }}
    </div>
</template>

<script setup>
    defineProps({
        emoji: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'text',
        },
    })
</script>
