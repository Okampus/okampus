<template>
    <font-awesome-icon v-if="type === 'icon'" :icon="emoji" size="lg" />
    <div v-else class="text-lg">
        {{ emoji }}
    </div>
</template>

<script>
export default {
    props: {
        emoji: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'text',
        },
    },
}
</script>
