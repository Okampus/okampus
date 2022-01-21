<template lang="">
    <font-awesome-icon
        v-if="emoji === 'icon'"
        :icon="emoji"
    />
    <div v-else>
        {{ emoji }}
    </div>
</template>

<script>
export default {
    props: {
        emoji: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'text'
        }
    }
}
</script>
