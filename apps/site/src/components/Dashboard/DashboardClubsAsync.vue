<template>
    <div>
        <div class="overflow-x-scroll snap-x snap-proximity">
            <AppTable
                class="w-max text-1"
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
                        name: 'handover',
                        text: 'Passation',
                        class: 'p-2  border-b border-gray-300',
                    },
                    {
                        name: 'statute',
                        text: 'Statut',
                        class: 'p-2  border-b border-gray-300',
                    },
                    {
                        name: 'internal',
                        text: 'Réglement interieur',
                        class: 'p-2  border-b border-gray-300',
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
                    <TeamActivity
                        class="z-50 h-full bg-1"
                        :team="{ avatar, name, category, teamId }"
                        :custom-string="category"
                    />
                    <!-- <router-link :to="`/club/${teamId}`" class="flex gap-1 items-center max-w-xs h-full bg-1">
                        <img :src="avatar" :alt="name" />
                        <div>{{ name }}</div>
                        <div class="text-xs text-gray-400">{{ category }}</div>
                    </router-link> -->
                </template>
                <template #owner="{ owner }">
                    <router-link :to="`/user/${owner.userId}`" class="flex gap-1 items-center cursor-pointer">
                        <ProfileAvatar :name="fullname(owner)" :avatar="owner.avatar" :size="2.5" />
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
                <template #handover="{ files }">
                    <div
                        v-if="files?.filter((file) => file?.description === 'handover')[0]"
                        class="flex justify-center items-center"
                    >
                        <a :href="files.filter((file) => file?.description === 'handover')[0]?.file?.url">
                            <DocumentIcon
                                class="w-8 h-8"
                                :file-name="
                                    files.filter((file) => file?.description === 'handover')[0]?.file?.name
                                "
                                :mime="
                                    files.filter((file) => file?.description === 'handover')[0]?.file
                                        ?.mimeType
                                "
                            />
                        </a>
                    </div>
                </template>
                <template #statute="{ files }">
                    <div
                        v-if="files?.filter((file) => file?.description === 'statute')[0]"
                        class="flex justify-center items-center"
                    >
                        <a :href="files.filter((file) => file?.description === 'statute')[0]?.file?.url">
                            <DocumentIcon
                                class="w-8 h-8"
                                :file-name="
                                    files.filter((file) => file?.description === 'statute')[0]?.file?.name
                                "
                                :mime="
                                    files.filter((file) => file?.description === 'statute')[0]?.file?.mimeType
                                "
                            />
                        </a>
                    </div>
                </template>
                <template #internal="{ files }">
                    <div
                        v-if="files?.filter((file) => file?.description === 'internal')[0]"
                        class="flex justify-center items-center"
                    >
                        <a :href="files.filter((file) => file?.description === 'internal')[0]?.file?.url">
                            <DocumentIcon
                                class="w-8 h-8"
                                :file-name="
                                    files.filter((file) => file?.description === 'internal')[0]?.file?.name
                                "
                                :mime="
                                    files.filter((file) => file?.description === 'internal')[0]?.file
                                        ?.mimeType
                                "
                            />
                        </a>
                    </div>
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
    import AppTable from '@/components/App/AppTable.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import DocumentIcon from '@/components/Document/DocumentIcon.vue'
    import TeamActivity from '../App/General/TeamActivity.vue'

    import { useClubsStore } from '@/store/clubs.store'
    import { fullname } from '@/utils/users'

    const clubStore = useClubsStore()
    await clubStore.getClubs()
    await clubStore.getClubsFiles('document')
</script>
