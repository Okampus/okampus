<template>
    <!-- TODO: add filtering, tab, info panel -->
    <AppView>
        <ListPage
            base-route="/threads"
            :store-callback="threads.getThreads"
            :store-getter="threads.getThreadById"
        >
            <template #default="{ items }">
                <ThreadList :threads="items" />
            </template>
        </ListPage>
    </AppView>
</template>

<script setup>
    import AppView from '@/views/App/AppView.vue'
    import ListPage from '@/views/App/ListPage.vue'
    import ThreadList from '@/views/Thread/ThreadList.vue'

    import { useThreadsStore } from '@/store/threads.store'

    const threads = useThreadsStore()
</script>
