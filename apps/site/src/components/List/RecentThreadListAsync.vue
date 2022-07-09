<template>
    <div class="flex flex-col">
        <ThreadCard
            v-for="thread in threads.threads"
            :key="thread.contentMasterId"
            :small="true"
            :thread="thread"
            class="mb-4"
        />
    </div>
</template>

<script setup>
    import ThreadCard from '@/components/App/ListCard/ThreadCard.vue'
    import { useThreadsStore } from '@/store/threads.store'

    const threads = useThreadsStore()
    await threads.getThreads({ itemsPerPage: 5 })
</script>
