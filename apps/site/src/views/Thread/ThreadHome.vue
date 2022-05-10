<template>
    <!-- TODO: add filtering, tab, info panel -->
    <ListPage base-route="/threads" :store-callback="threads.getThreads">
        <template #default="{ items }">
            <ThreadList :threads="items" />
        </template>
    </ListPage>
</template>

<script setup>
    import ListPage from '@/views/App/ListPage.vue'
    import ThreadList from '@/views/Thread/ThreadList.vue'

    import { useThreadsStore } from '@/store/threads.store'

    const threads = useThreadsStore()
</script>
