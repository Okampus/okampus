<template>
    <GraphQLQuery :query="getClubs" :update="(data) => data?.clubs">
        <template #default="{ data: clubs }">
            <div class="bg-1 sticky top-0 z-50 px-2 md:hidden">
                <HorizontalTabs
                    v-model="currentTab"
                    :tabs="getTabsFromClubs(clubs).value"
                    route-base="/clubs"
                    route-name="clubs"
                />
            </div>
            <div class="centered-container-padded flex flex-col gap-4 md:flex-row">
                <VerticalTabs
                    v-model="currentTab"
                    :tabs="getTabsFromClubs(clubs).value"
                    route-base="/clubs"
                    route-name="clubs"
                    class="sticky top-8 hidden md:block"
                />
                <div v-if="currentClubs.length === 0" class="text-0 w-full text-center">
                    <EmojiSad class="mb-3 text-3xl" />
                    <div class="text-2xl font-bold">Aucune association ne correspond à ces critères.</div>
                    <div class="text-lg">
                        Essayez la
                        <router-link to="/clubs" class="link-blue"
                            >liste de toutes les associations</router-link
                        >.
                    </div>
                </div>
                <div v-else class="flex h-fit w-full flex-wrap gap-4">
                    <ClubJoinForm
                        v-model:show="showJoinForm"
                        :club="joiningClub"
                        @closed="joiningClubId = null"
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
    import ClubCard from '@/components/App/ListCard/ClubCard.vue'

    import ClubJoinForm from '@/components/Club/ClubJoinForm.vue'
    import EmojiSad from '@/icons/Emoji/EmojiSad.vue'
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'

    import { getClubs } from '@/graphql/queries/teams/getClubs'
    import { computed, ref } from 'vue'

    import { clubTypes } from '@/shared/types/club-types.enum'
    import { i18n } from '@/shared/modules/i18n'
    import { groupBy } from 'lodash'

    // import { emitter } from '@/shared/modules/emitter'

    // import { getStatusAxiosError } from '@/utils/errors'

    // import { useAuthStore } from '@/store/auth.store'
    // import { useClubsStore } from '@/store/clubs.store'
    // import { groupBy } from 'lodash'
    // import { specialRoles, IS_WAITING, IS_MEMBER, IS_SPECIAL_ROLE } from '@/shared/types/club-roles.enum'

    // const auth = useAuthStore()
    // const clubs = useClubsStore()
    // getClubs

    const currentTab = ref(null)

    // const ALL = 0
    const ALL_LABEL = 'all'
    // const MY_CLUBS = 1
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

    // const CATEGORIES = 1

    // const clubList = ref([])
    // const clubListByCategory = ref({})
    // const categories = ref([])
    // // const schema = ref([])

    const showJoinForm = ref(false)
    const joiningClub = ref(null)

    // const joinForm = ref(null)
    // const joinFormData = ref({})
    // const joiningClubId = ref(null)
    // const joiningClub = computed(
    //     () => clubList.value.find((club) => club.id === joiningClubId.value) ?? { name: '' },
    // )

    const currentClubs = (clubs) =>
        computed(() => {
            const clubTypeFromTab = Object.fromEntries(
                Object.values(clubTypes).map((type) => [type.link, type[i18n.global.locale]]),
            )
            return !currentTab.value || currentTab.value === ALL_LABEL
                ? clubs
                : currentTab.value === MY_CLUBS_LABEL
                ? clubs.filter((club) => club.userMembership.membership)
                : currentTab.value in clubTypeFromTab
                ? clubs.filter((club) => club.category === clubTypeFromTab[currentTab.value])
                : clubs.filter((club) => club.category === currentTab.value)
        })

    // const currentClubs = computed(() =>
    //     currentTab.value === ALL_LABEL
    //         ? clubList.value
    //         : currentTab.value === MY_CLUBS_LABEL
    //         ? clubList.value.filter((club) => !!club.membership && club.membership !== IS_WAITING)
    //         : categories.value.includes(linkToClubType[currentTab.value])
    //         ? clubListByCategory.value[linkToClubType[currentTab.value]]
    //         : [],
    // )

    // const loadClubList = async () => {
    //     await clubs
    //         .getClubs()
    //         .then((res) => {
    //             clubList.value = res
    //             clubListByCategory.value = groupBy(res, 'category')

    //             tabs[ALL].tabs[ALL].amount = res.length

    //             categories.value = Object.keys(clubListByCategory.value)
    //             tabs[CATEGORIES].tabs = Object.entries(clubListByCategory.value).map((category) => ({
    //                 id: clubTypes[category[0]].link,
    //                 name: category[0],
    //                 amount: category[1].length,
    //             }))
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatusAxiosError(err) })
    //         })
    // }

    // const getMemberships = async () => {
    //     await clubs
    //         .getMembershipsOf(auth.user)
    //         .then((memberships) => {
    //             memberships.forEach((membership) => {
    //                 clubList.value.find((club) => club.id === membership.team.id).membership =
    //                     specialRoles.includes(membership.role) ? IS_SPECIAL_ROLE : IS_MEMBER
    //             })
    //             tabs[ALL].tabs[MY_CLUBS].amount = clubList.value.filter(
    //                 (club) => !!club.membership && club.membership !== IS_WAITING,
    //             ).length
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatusAxiosError(err) })
    //         })
    // }

    // const PENDING_STATE = 'pending'
    // const getRequests = async () => {
    //     await clubs
    //         .getMembershipRequestsOf(auth.user)
    //         .then((requests) => {
    //             requests
    //                 .filter((request) => request.state === PENDING_STATE)
    //                 .forEach((request) => {
    //                     clubList.value.find((club) => club.id === request.team.id).membership = IS_WAITING
    //                 })
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatusAxiosError(err) })
    //         })
    // }

    // // const loadSchema = async (clubId) => {
    // //     clubs.getClub(clubId).then((club) => {
    // //         schema.value = club?.membershipRequestForm.form ?? null
    // //     })
    // // }

    // await loadClubList()
    // await Promise.all([getMemberships(), getRequests()])
</script>
