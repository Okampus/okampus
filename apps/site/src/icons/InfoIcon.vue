<template>
    <i
        v-tooltip="tooltip"
        class="far fa-circle-question text-2 ml-2 cursor-help text-xl hover:text-blue-500"
    />
</template>

<script setup>
    defineProps({
        tooltip: {
            type: String,
            required: true,
        },
    })
</script>
