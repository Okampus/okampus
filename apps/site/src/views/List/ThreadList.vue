<template>
    <ListPage :base-route="baseRoute" :store-callback="threads.getThreads" resource-name="thread">
        <template #default="{ items }">
            <div class="flex flex-col gap-4">
                <ThreadCard v-for="thread in items" :key="thread.contentMasterId" :thread="thread" />
            </div>
        </template>
    </ListPage>
</template>

<script setup>
    import { useThreadsStore } from '@/store/threads.store'
    import ThreadCard from '@/components/App/ListCard/ThreadCard.vue'
    import ListPage from '../App/ListPage.vue'

    const threads = useThreadsStore()

    defineProps({
        baseRoute: {
            type: String,
            required: true,
        },
    })
</script>
