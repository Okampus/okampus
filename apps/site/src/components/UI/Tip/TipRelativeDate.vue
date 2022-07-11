<template>
    <TipPopper :tip="dateString">
        <span class="flex items-center cursor-default" :class="textClass">
            {{ timeAgo(date, 'long', limit) }}
        </span>
    </TipPopper>
</template>

<script setup>
    import { timeAgo } from '@/utils/timeAgo'
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'

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

    const dateString = new Intl.DateTimeFormat('fr', { dateStyle: 'full', timeStyle: 'long' }).format(
        new Date(props.date),
    )
</script>
