<template>
    <!-- TODO: add on hover extra date info -->
    <div class="flex items-center">
        {{ timeAgo(dateString, 'long') }}
    </div>
</template>

<script>
import { timeAgo } from '@/utils/timeAgo'

export default {
    props: {
        dateString: {
            type: String,
            default: '',
        },
    },
    methods: { timeAgo },
}
</script>
