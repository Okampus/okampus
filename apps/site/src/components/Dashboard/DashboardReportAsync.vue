<template>
    <div>
        <AppTable
            class="w-full"
            :items="reportStore.reports"
            table-layout="fixed"
            :headers="[
                {
                    name: 'content',
                    text: 'Contenu',
                    class: 'p-2  border-b border-gray-300',
                },
                {
                    name: 'author',
                    text: 'Auteur',
                    class: 'p-2 border-b border-gray-300',
                },
                {
                    name: 'reporter',
                    text: 'Rapporteur',
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
                <div class="text-sm break-words">{{ content.body }}</div>
            </template>
            <template #author="{ content: { author } }">
                <router-link :to="`/user/${author.userId}`" class="flex gap-1 items-center cursor-pointer">
                    <ProfileAvatar
                        :name="fullname(author.firstname, author.lastname)"
                        :avatar="author.avatar"
                        :size="2.5"
                    >
                    </ProfileAvatar>
                    <div>
                        {{ fullname(author) }}
                    </div>
                </router-link>
            </template>
            <template #reporter="{ reporter }">
                <router-link :to="`/user/${reporter.userId}`" class="flex gap-1 items-center cursor-pointer">
                    <ProfileAvatar
                        :name="fullname(reporter.firstname, reporter.lastname)"
                        :avatar="reporter.avatar"
                        :size="2.5"
                    >
                    </ProfileAvatar>
                    <div>{{ fullname(reporter) }}</div>
                </router-link>
            </template>
            <template #reason="{ reason }">
                <div class="text-sm break-words">{{ reason }}</div>
            </template>
        </AppTable>
    </div>
</template>

<script setup>
    import AppTable from '../App/AppTable.vue'
    import { useReportsStore } from '@/store/reports.store'
    import { fullname } from '@/utils/users'
    import ProfileAvatar from '../Profile/ProfileAvatar.vue'

    const reportStore = useReportsStore()
    await reportStore.getReports()
</script>
