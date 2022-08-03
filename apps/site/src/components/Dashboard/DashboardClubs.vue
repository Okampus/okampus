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
                        <AvatarGroup
                            :total-user-count="activeMemberCount"
                            :users="
                                boardMembers.map((membership) => ({
                                    ...membership.user,
                                    title: `${clubRoleNames[membership.role][locale]} de ${name}`,
                                }))
                            "
                        />
                    </div>
                </template>
            </ScrollableTable>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import AvatarGroup from '@/components/List/AvatarGroup.vue'
    import ScrollableTable from '@/components/App/ScrollableTable.vue'
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import TeamActivity from '@/components/App/General/TeamActivity.vue'

    import { getClubs } from '@/graphql/queries/teams/getClubs.js'
    import { clubRoleNames } from '@/shared/types/club-roles.enum'

    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n({ useScope: 'global' })
</script>
