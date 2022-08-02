<template>
    <TipPopper :tip="dateString">
        <span class="flex cursor-default items-center" :class="textClass">
            {{ timeAgo(date, 'long', limit) }}
        </span>
    </TipPopper>
</template>

<script setup>
    import { timeAgo } from '@/utils/timeAgo'
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'
    import { formatDateLong } from '@/utils/dateUtils.js'

    const props = defineProps({
        date: {
            type: [String, Date],
            required: true,
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
