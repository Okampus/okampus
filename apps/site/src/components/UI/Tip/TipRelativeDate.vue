<template>
    <span v-tooltip="dateString" class="cursor-default" :class="textClass">
        {{ action }} {{ timeAgo(date, dateStyle, limit) }}
    </span>
</template>

<script setup>
    import { timeAgo } from '@/utils/timeAgo'
    import { formatDateLong } from '@/utils/dateUtils.js'

    const props = defineProps({
        action: {
            type: String,
            default: '',
        },
        date: {
            type: [String, Date],
            required: true,
        },
        dateStyle: {
            type: String,
            default: 'long',
        },
        limit: {
            type: Boolean,
            default: true,
        },
        textClass: {
            type: [String, Object, Array],
            default: '',
        },
    })

    const dateString = formatDateLong(props.date)
</script>
