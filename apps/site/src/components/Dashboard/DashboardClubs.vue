<template>
    <div>
        <div class="overflow-x-scroll snap-x snap-proximity">
            <AppTable
                class="w-max"
                :items="clubStore.clubs"
                table-layout="auto"
                :headers="[
                    {
                        name: 'name',
                        text: 'Nom',
                        class: 'p-2 z-10 border-b border-gray-300 bg-1',
                        sortable: true,
                    },
                    {
                        name: 'owner',
                        text: 'Président',
                        class: 'p-2 border-b border-gray-300',
                    },
                    {
                        name: 'secretary',
                        text: 'Secrétaire',
                        class: 'p-2 border-b border-gray-300',
                    },
                    {
                        name: 'treasurer',
                        text: 'Trésorier',
                        class: 'p-2  border-b border-gray-300',
                    },
                    {
                        name: 'members',
                        text: 'Membres',
                        class: 'p-2 z-10 border-b border-gray-300 bg-1',
                        sortable: true,
                    },
                    {
                        name: 'budget',
                        text: 'Budget',
                        class: 'p-2  border-b border-gray-300',
                        sortable: true,
                    },
                    {
                        name: 'shortDescription',
                        text: 'Description',
                        class: 'p-2  border-b border-gray-300',
                    },
                ]"
                :first-column-fixed="true"
            >
                <template #name="{ avatar, name, category, teamId }">
                    <router-link :to="`/club/${teamId}`" class="flex gap-1 items-center max-w-sm h-full bg-1">
                        <img :src="avatar" :alt="name" />
                        <div>{{ name }}</div>
                        <div class="text-xs text-gray-400">{{ category }}</div>
                    </router-link>
                </template>
                <template #owner="{ owner }">
                    <router-link :to="`/user/${owner.userId}`" class="flex gap-1 items-center cursor-pointer">
                        <ProfileAvatar
                            :name="fullname(owner)"
                            :avatar="owner.avatar"
                            :size="2.5"
                        ></ProfileAvatar>
                        <div>{{ fullname(owner) }}</div>
                    </router-link>
                </template>
                <template #secretary="{ secretary }">
                    <router-link
                        v-if="secretary"
                        :to="`/user/${secretary.userId}`"
                        class="flex gap-1 items-center cursor-pointer"
                    >
                        <ProfileAvatar :name="fullname(secretary)" :avatar="secretary.avatar"></ProfileAvatar>
                        <div>{{ fullname(secretary) }}</div>
                    </router-link>
                </template>
                <template #treasurer="{ treasurer }">
                    <router-link
                        v-if="treasurer"
                        :to="`/user/${treasurer.userId}`"
                        class="flex gap-1 items-center cursor-pointer"
                    >
                        <ProfileAvatar :name="fullname(treasurer)" :avatar="treasurer.avatar"></ProfileAvatar>
                        <div>{{ fullname(treasurer) }}</div>
                    </router-link>
                </template>
                <template #shortDescription="{ shortDescription }">
                    <div class="max-w-lg text-sm">
                        {{ shortDescription }}
                    </div>
                </template>
            </AppTable>
        </div>
    </div>
</template>

<script setup>
    import { useClubsStore } from '@/store/clubs.store'
    import AppTable from '@/components/App/AppTable.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import { fullname } from '@/utils/users'

    const clubStore = useClubsStore()
    clubStore.getClubs()
</script>
