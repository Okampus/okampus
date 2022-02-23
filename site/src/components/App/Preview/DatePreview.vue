<template>
    <!-- TODO: add on hover extra date info -->
    <span class="flex items-center">
        {{ timeAgo(date, 'long') }}
    </span>
</template>

<script>
    import { timeAgo } from '@/utils/timeAgo'

    export default {
        props: {
            date: {
                type: String,
                default: '',
            },
        },
        methods: { timeAgo },
    }
</script>
