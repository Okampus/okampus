<template>
    <GraphQLQuery :query="getClubs" :update="(data) => data?.clubs">
        <template #default="{ data: clubs }">
            <ScrollableTable
                class="h-[50vh]"
                :items="clubs"
                :columns="[
                    {
                        id: 'name',
                        title: 'Nom',
                        sortable: true,
                    },
                    {
                        id: 'members',
                        title: 'Membres',
                        sortable: true,
                    },
                    {
                        id: 'shortDescription',
                        title: 'Description',
                    },
                    // {
                    //     id: 'budget',
                    //     title: 'Budget',
                    //     class: 'p-2  border-b border-gray-300',
                    //     sortable: true,
                    // },
                    // {
                    //     id: 'handover',
                    //     title: 'Passation',
                    //     class: 'p-2  border-b border-gray-300',
                    // },
                    // {
                    //     id: 'statute',
                    //     title: 'Statut',
                    //     class: 'p-2  border-b border-gray-300',
                    // },
                    // {
                    //     id: 'internal',
                    //     title: 'Réglement interieur',
                    //     class: 'p-2  border-b border-gray-300',
                    // },
                ]"
                :first-column-fixed="true"
            >
                <template #name="{ avatar, name, category, teamId }">
                    <TeamActivity :team="{ avatar, name, category, teamId }">
                        <template #subtitle>
                            {{ category }}
                        </template>
                    </TeamActivity>
                </template>
                <template #shortDescription="{ shortDescription }">
                    <div class="text-sm">
                        {{ shortDescription }}
                    </div>
                </template>
                <template #members="{ activeMemberCount, boardMembers, name }">
                    <div class="flex justify-center">
                        <div class="text-0 ml-4 flex flex-row-reverse gap-1">
                            <span v-if="activeMemberCount > boardMembers.length" class="text-0 my-auto"
                                >+ {{ abbrNumbers(activeMemberCount - boardMembers.length) }}</span
                            >
                            <div v-for="(specialMember, i) in boardMembers" :key="i" class="-ml-3">
                                <TipPopper
                                    placement="top"
                                    offset="12"
                                    :delay="200"
                                    @open="hovering = i"
                                    @close="hovering = null"
                                >
                                    <template #content>
                                        <UserAboutCard
                                            :user="specialMember.user"
                                            :title="`${clubRoleNames[specialMember.role][locale]} de ${name}`"
                                        />
                                    </template>
                                    <div class="avatar-hover rounded-full">
                                        <template v-if="isMobile">
                                            <div>
                                                <ProfileAvatar
                                                    class="bg-2 relative rounded-full p-1 !shadow-none"
                                                    :class="{ 'hoverred': hovering === i }"
                                                    :size="2.5"
                                                    :avatar="specialMember.user.avatar"
                                                    :name="fullname(specialMember.user)"
                                                />
                                            </div>
                                        </template>
                                        <template v-else>
                                            <router-link :to="`/user/${specialMember.user.id}`">
                                                <ProfileAvatar
                                                    class="hovered bg-2 relative cursor-pointer rounded-full !shadow-none"
                                                    :size="2.5"
                                                    :avatar="specialMember.user.avatar"
                                                    :name="fullname(specialMember.user)"
                                                />
                                            </router-link>
                                        </template>
                                    </div>
                                </TipPopper>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- <template #handover="{ files }">
                    <div
                        v-if="files?.filter((file) => file?.description === 'handover')[0]"
                        class="flex items-center justify-center"
                    >
                        <a :href="files.filter((file) => file?.description === 'handover')[0]?.file?.url">
                            <DocumentIcon
                                class="h-8 w-8"
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
                        class="flex items-center justify-center"
                    >
                        <a :href="files.filter((file) => file?.description === 'statute')[0]?.file?.url">
                            <DocumentIcon
                                class="h-8 w-8"
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
                        class="flex items-center justify-center"
                    >
                        <a :href="files.filter((file) => file?.description === 'internal')[0]?.file?.url">
                            <DocumentIcon
                                class="h-8 w-8"
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
                </template> -->
            </ScrollableTable>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    // import DocumentIcon from '@/components/Document/DocumentIcon.vue'
    import ScrollableTable from '@/components/App/ScrollableTable.vue'
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import UserAboutCard from '@/components/User/UserAboutCard.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import TeamActivity from '@/components/App/General/TeamActivity.vue'
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'

    // import { useClubsStore } from '@/store/clubs.store'
    import { getClubs } from '@/graphql/queries/teams/getClubs.js'

    import { fullname } from '@/utils/users'
    import { abbrNumbers } from '@/utils/abbrNumbers'
    import { clubRoleNames } from '@/shared/types/club-roles.enum'

    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n({ useScope: 'global' })
    // const clubStore = useClubsStore()
    // await clubStore.getClubs()
    // await clubStore.getClubsFiles('document')
</script>
