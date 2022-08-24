<template>
    <GraphQLQuery
        :query="getReports"
        :update="(data) => data?.reports"
        resource-type="report"
        route-base="/admin/reports"
        :whole-page="true"
        class="flex flex-col"
    >
        <template #default="{ data: reports }">
            <ScrollableTable
                class="text-0 w-full"
                :items="reports"
                table-layout="fixed"
                :columns="[
                    {
                        id: 'content',
                        title: 'Contenu',
                    },
                    {
                        id: 'author',
                        title: 'Auteur originel',
                    },
                    {
                        id: 'reporter',
                        title: 'Signalé par',
                    },
                    {
                        id: 'reason',
                        title: 'Raison',
                    },
                ]"
            >
                <template #content="{ data: { content } }">
                    <router-link
                        :to="`/forum/post/${content.contentMaster.id}#${contentTypeNames[content.kind].key}-${
                            content.id
                        }`"
                        class="break-words text-sm hover:underline"
                        >{{ content.body }}</router-link
                    >
                </template>
                <template #author="{ data: { target } }">
                    <router-link :to="`/user/${target.id}`" class="flex cursor-pointer items-center gap-1">
                        <ProfileAvatar :name="fullname(target)" :avatar="target.avatar" :size="2.5">
                        </ProfileAvatar>
                        <div>
                            {{ fullname(target) }}
                        </div>
                    </router-link>
                </template>
                <template #reporter="{ data: { user } }">
                    <router-link :to="`/user/${user.id}`" class="flex cursor-pointer items-center gap-1">
                        <ProfileAvatar :name="fullname(user)" :avatar="user.avatar" :size="2.5">
                        </ProfileAvatar>
                        <div>{{ fullname(user) }}</div>
                    </router-link>
                </template>
                <template #reason="{ data: { reason } }">
                    <div class="break-words text-sm">{{ reason }}</div>
                </template>
            </ScrollableTable>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import ScrollableTable from '@/components/App/ScrollableTable.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'

    import { getReports } from '@/graphql/queries/threads/getReports'
    import { fullname } from '@/utils/users'
    import { contentTypeNames } from '@/shared/types/content-kinds.enum'
</script>
