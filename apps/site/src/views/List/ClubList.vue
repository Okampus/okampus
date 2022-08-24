<template>
    <GraphQLQuery :query="getClubs" :update="(data) => data?.clubs">
        <template #default="{ data: clubs }">
            <div class="bg-1 sticky top-0 z-50 px-4 md:hidden">
                <HorizontalTabs
                    v-model="currentTab"
                    :tabs="getTabsFromClubs(clubs).value"
                    route-base="/clubs"
                    route-name="clubs"
                />
            </div>
            <div class="centered-container padded flex flex-col gap-4 md:flex-row">
                <VerticalTabs
                    v-model="currentTab"
                    :tabs="getTabsFromClubs(clubs).value"
                    route-base="/clubs"
                    route-name="clubs"
                    class="sticky top-4 hidden md:block"
                />
                <div class="grid h-fit w-full grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4">
                    <FormPopUp
                        v-model:show="showJoinForm"
                        :submit="
                            (form) =>
                                join({
                                    id: joiningClub?.id,
                                    request: {
                                        role: form.role ?? MEMBER,
                                        originalFormId: joiningClub?.membershipRequestForm?.id,
                                        formSubmission: form,
                                    },
                                })
                        "
                        :submit-button="{
                            icon: 'envelope',
                            label: 'Rejoindre',
                        }"
                        :form-schema="joiningClub?.formSchema ?? DEFAULT_JOIN_FORM_SCHEMA"
                        :form-data="{ club: joiningClub }"
                    />
                    <ClubCard
                        v-for="club in currentClubs(clubs).value"
                        :key="club.id"
                        :club="club"
                        @join="
                            () => {
                                showJoinForm = true
                                joiningClub = club
                            }
                        "
                    />
                </div>
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import VerticalTabs from '@/components/UI/Tabs/VerticalTabs.vue'
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import FormPopUp from '@/components/Form/FormPopUp.vue'
    import ClubCard from '@/components/App/ListCard/ClubCard.vue'

    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'

    import { getClubs } from '@/graphql/queries/teams/getClubs'
    import { computed, ref } from 'vue'

    import { clubTypes } from '@/shared/types/club-types.enum'
    import { groupBy } from 'lodash'

    import { useI18n } from 'vue-i18n'
    import { joinTeam } from '@/graphql/queries/teams/joinTeam.js'
    import { useMutation } from '@vue/apollo-composable'
    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast.js'

    import { DEFAULT_JOIN_FORM_SCHEMA } from '@/shared/assets/form-schemas/default-schemas.js'

    const { locale } = useI18n({ useScope: 'global' })

    const currentTab = ref(null)

    const ALL_LABEL = 'all'
    const MY_CLUBS_LABEL = 'my-clubs'

    const getTabsFromClubs = (clubs) => {
        const clubsByCategory = groupBy(clubs, 'category')
        const categories = Object.entries(clubsByCategory).map(([type, clubsOfType]) => ({
            id: type in clubTypes ? clubTypes[type].link : type,
            name: type,
            amount: clubsOfType.length,
        }))

        return computed(() => [
            {
                id: 'all',
                title: 'Les assos',
                tabs: [
                    {
                        id: 'all',
                        route: '/clubs',
                        name: 'Toutes les assos',
                        amount: clubs.length,
                    },
                    {
                        id: 'my-clubs',
                        name: 'Mes associations',
                        amount: clubs.filter((club) => club.userMembership.membership).length,
                    },
                ],
            },
            ...(categories.length
                ? [
                      {
                          id: 'categories',
                          title: 'Catégories',
                          tabs: categories,
                      },
                  ]
                : []),
        ])
    }

    const showJoinForm = ref(false)
    const joiningClub = ref({ name: '' })

    const { mutate: join, onDone, onError } = useMutation(joinTeam)
    onDone(() => {
        showSuccessToast('Votre demande a bien été envoyée ✉️')
        showJoinForm.value = false
    })
    onError(showToastGraphQLError)

    const currentClubs = (clubs) =>
        computed(() => {
            const clubTypeFromTab = Object.fromEntries(
                Object.values(clubTypes).map((type) => [type.link, type[locale.value]]),
            )
            return !currentTab.value || currentTab.value === ALL_LABEL
                ? clubs
                : currentTab.value === MY_CLUBS_LABEL
                ? clubs.filter((club) => club.userMembership.membership)
                : currentTab.value in clubTypeFromTab
                ? clubs.filter((club) => club.category === clubTypeFromTab[currentTab.value])
                : clubs.filter((club) => club.category === currentTab.value)
        })
</script>
