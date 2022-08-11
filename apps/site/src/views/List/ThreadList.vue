<template>
    <GraphQLQuery
        :query="getThreads"
        :update="(data) => data?.threads"
        resource-type="thread"
        route-base="/forum/posts"
        class="flex flex-col gap-4"
        :class="container ? 'centered-container-padded' : ''"
        :whole-page="container"
    >
        <template #default="{ data: threads }">
            <ThreadCard v-for="thread in threads" :key="thread.id" :thread="thread" />
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import ThreadCard from '@/components/App/ListCard/ThreadCard.vue'
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import { getThreads } from '@/graphql/queries/getThreads'

    defineProps({
        container: {
            type: Boolean,
            default: true,
        },
    })
</script>
