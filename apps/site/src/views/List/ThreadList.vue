<template>
    <ListPage :base-route="baseRoute" :route-name="routeName" :store-callback="threads.getThreads">
        <template #default="{ items }">
            <div v-if="items.length" class="flex flex-col gap-4">
                <ThreadCard v-for="thread in items" :key="thread.contentMasterId" :thread="thread" />
            </div>
            <div v-else class="text-center text-0">
                <EmojiSad class="mb-3 text-3xl" />
                <div class="text-2xl font-bold">Aucun post ne correspond à ces critères.</div>
                <div class="text-lg">
                    Essayez la
                    <router-link to="posts" class="link-blue">liste de tous les posts</router-link>.
                </div>
            </div>
        </template>
    </ListPage>
</template>

<script setup>
    import ThreadCard from '@/components/App/ListCard/ThreadCard.vue'
    import ListPage from '@/views/App/ListPage.vue'
    import EmojiSad from '@/icons/Emoji/EmojiSad.vue'

    import { useThreadsStore } from '@/store/threads.store'

    const threads = useThreadsStore()

    defineProps({
        baseRoute: {
            type: String,
            default: '/threads',
        },
        routeName: {
            type: String,
            default: 'threads',
        },
    })
</script>
