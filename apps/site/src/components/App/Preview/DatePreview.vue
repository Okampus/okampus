<template>
    <AppTip :tip="dateString">
        <span class="flex items-center">
            {{ timeAgo(date, 'long') }}
        </span>
    </AppTip>
</template>

<script setup>
    import { timeAgo } from '@/utils/timeAgo'
    import AppTip from '../AppTip.vue'

    const props = defineProps({
        date: {
            type: String,
            required: true,
        },
    })

    const dateString = new Intl.DateTimeFormat('fr', { dateStyle: 'full', timeStyle: 'long' }).format(
        new Date(props.date),
    )
</script>
