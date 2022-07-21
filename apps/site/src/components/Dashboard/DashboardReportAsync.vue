<template>
    <GraphQLQuery
        :query="getReports"
        :update="(data) => data?.reports"
        resource-type="report"
        route-base="/admin/reports"
    >
        <template #default="{ data: reports }">
            <AppTable
                class="w-full text-0"
                :items="reports"
                table-layout="fixed"
                :headers="[
                    {
                        name: 'content',
                        text: 'Contenu',
                        class: 'p-2  border-b border-gray-300',
                    },
                    {
                        name: 'author',
                        text: 'Auteur originel',
                        class: 'p-2 border-b border-gray-300',
                    },
                    {
                        name: 'reporter',
                        text: 'Signalé par',
                        class: 'p-2 border-b border-gray-300',
                    },
                    {
                        name: 'reason',
                        text: 'Raison',
                        class: 'p-2 border-b border-gray-300',
                    },
                ]"
            >
                <template #content="{ content }">
                    <router-link
                        :to="`/forum/post/${content.contentMaster.id}#${contentTypeNames[content.kind].key}-${
                            content.id
                        }`"
                        class="text-sm hover:underline break-words"
                        >{{ content.body }}</router-link
                    >
                </template>
                <template #author="{ target }">
                    <router-link :to="`/user/${target.id}`" class="flex gap-1 items-center cursor-pointer">
                        <ProfileAvatar :name="fullname(target)" :avatar="target.avatar" :size="2.5">
                        </ProfileAvatar>
                        <div>
                            {{ fullname(target) }}
                        </div>
                    </router-link>
                </template>
                <template #reporter="{ user }">
                    <router-link :to="`/user/${user.id}`" class="flex gap-1 items-center cursor-pointer">
                        <ProfileAvatar :name="fullname(user)" :avatar="user.avatar" :size="2.5">
                        </ProfileAvatar>
                        <div>{{ fullname(user) }}</div>
                    </router-link>
                </template>
                <template #reason="{ reason }">
                    <div class="text-sm break-words">{{ reason }}</div>
                </template>
            </AppTable>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import AppTable from '@/components/App/AppTable.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'

    import { getReports } from '@/graphql/queries/getReports'
    import { fullname } from '@/utils/users'
    import { contentTypeNames } from '@/shared/types/content-kinds.enum'
</script>
