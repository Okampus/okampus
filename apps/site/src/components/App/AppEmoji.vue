<template>
    <i v-if="type === 'icon'" class="fas" :class="`fa-${emoji}`" />
    <div v-else class="text-lg">
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
