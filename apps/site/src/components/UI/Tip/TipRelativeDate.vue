<template>
    <TipPopper :tip="dateString">
        <span class="flex items-center cursor-default">
            {{ timeAgo(date, 'long') }}
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
    })

    const dateString = new Intl.DateTimeFormat('fr', { dateStyle: 'full', timeStyle: 'long' }).format(
        new Date(props.date),
    )
</script>
