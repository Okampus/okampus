<template>
    <GraphQLQuery :query="getClubs" :update="(data) => data?.clubs">
        <template #default="{ data: clubs }">
            <ScrollableTable
                class="h-[70vh]"
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
                    ...Object.entries(TEAM_FILES).map(([key, value]) => ({
                        id: key,
                        title: value.name[locale],
                    })),
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
                ]"
                :first-column-fixed="true"
            >
                <template #name="{ data: { avatar, name, category, teamId } }">
                    <TeamActivity :team="{ avatar, name, category, teamId }">
                        <template #subtitle>
                            {{ category }}
                        </template>
                    </TeamActivity>
                </template>
                <template #shortDescription="{ data: { shortDescription } }">
                    <div v-tooltip="shortDescription" class="text-sm line-clamp-2">
                        {{ shortDescription }}
                    </div>
                </template>
                <template #members="{ data: { activeMemberCount, boardMembers, name, id }, row }">
                    <div class="flex justify-center">
                        <AvatarGroup
                            :link="`/club/${id}/members`"
                            :bg-class="
                                row % 2
                                    ? 'bg-0 border-0-light dark:border-0-dark'
                                    : 'bg-2 border-2-light dark:border-2-dark'
                            "
                            :total-count="activeMemberCount"
                            :entities="
                                boardMembers.map((membership) => ({
                                    ...membership.user,
                                    text: `${clubRoleNames[membership.role][locale]} de ${name}`,
                                }))
                            "
                        />
                    </div>
                </template>
                <template
                    v-for="(_, teamFileType) in TEAM_FILES"
                    :key="teamFileType"
                    #[teamFileType]="{ data: { teamFiles } }"
                >
                    <DocumentIcon
                        v-if="teamFiles.find((file) => file.type === teamFileType)"
                        :file="{ fileType: documentType }"
                        class="scale-on-hover h-12 cursor-pointer"
                        @click="
                            downloadFile(teamFiles.find((file) => file.type === teamFileType)?.file, false)
                        "
                    />
                </template>
            </ScrollableTable>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import ScrollableTable from '@/components/App/ScrollableTable.vue'

    import AvatarGroup from '@/components/List/AvatarGroup.vue'
    import DocumentIcon from '@/components/Document/DocumentIcon.vue'
    import TeamActivity from '@/components/App/General/TeamActivity.vue'

    import { useI18n } from 'vue-i18n'

    import { getClubs } from '@/graphql/queries/teams/getClubs.js'
    import { clubRoleNames } from '@/shared/types/club-roles.enum'

    import { TEAM_FILES } from '@/shared/types/team-files.enum'
    import { DOCUMENT, FILE_TYPES } from '@/shared/assets/file-types'

    import { downloadFile } from '@/utils/downloadFile'

    const { locale } = useI18n({ useScope: 'global' })

    const documentType = FILE_TYPES[DOCUMENT]
</script>
