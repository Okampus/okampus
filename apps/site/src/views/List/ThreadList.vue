<template>
    <ListPage :route-base="routeBase" :route-name="routeName" :callback="threads.getThreads" :type="THREAD">
        <template #default="{ items }">
            <div v-if="items.length" class="flex flex-col gap-4 centered-container">
                <ThreadCard
                    v-for="thread in items"
                    :key="thread.contentMasterId"
                    :thread="thread"
                    class="mb-4"
                />
            </div>
        </template>
    </ListPage>
</template>

<script setup>
    import ThreadCard from '@/components/App/ListCard/ThreadCard.vue'
    import ListPage from '@/views/App/ListPage.vue'

    import { THREAD } from '@/shared/types/resource-names.enum'
    import { useThreadsStore } from '@/store/threads.store'

    const threads = useThreadsStore()

    defineProps({
        routeBase: {
            type: String,
            default: '/forum/posts',
        },
        routeName: {
            type: String,
            default: 'posts',
        },
    })
</script>
