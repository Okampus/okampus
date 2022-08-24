<template>
    <GraphQLQuery
        :query="getClub"
        :variables="{ id: parseInt(route.params.clubId) }"
        :update="(data) => data?.clubById"
    >
        <template #default="{ data: club }">
            <div class="relative flex flex-col">
                <div class="bg-2 text-0">
                    <div class="centered-container padded sticky top-0 z-30 flex flex-col pb-0">
                        <div class="flex items-center justify-between gap-4">
                            <div class="flex items-center gap-4">
                                <ProfileAvatar
                                    :avatar="club.avatar"
                                    :name="club.name"
                                    :size="4"
                                    :rounded-full="false"
                                />
                                <div class="flex gap-x-4 lg:items-center lg-max:flex-col">
                                    <div class="text-2xl">{{ club.name }}</div>
                                    <LabelSimple class="cursor-default bg-slate-600/40 hover:bg-slate-600/40">
                                        Vue administrateur
                                    </LabelSimple>
                                </div>
                            </div>
                            <router-link :to="clubRoute" class="text-lg text-blue-500">
                                {{ md ? 'Voir en tant que visiteur' : 'Vue visiteur' }}
                            </router-link>
                        </div>
                        <HorizontalTabs
                            v-model="currentTab"
                            :tabs="tabs"
                            :route-base="clubManageRoute"
                            route-name="manage-club"
                            :background-variant="2"
                        />
                    </div>
                </div>
                <div class="centered-container mt-4 flex flex-col">
                    <component :is="currentComponent" :club="club" />
                </div>
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import WIP from '@/views/App/WIP.vue'

    import ManageHomepage from '@/components/Profile/Manage/ManageHomepage.vue'
    import ManageRequestsAsync from '@/components/Profile/Manage/ManageRequestsAsync.vue'
    import ManageDriveAsync from '@/components/Profile/Manage/ManageDriveAsync.vue'
    import ManageActivityAsync from '@/components/Profile/Manage/ManageActivityAsync.vue'

    import ClubMembers from '@/components/Profile/Club/ClubMembers.vue'

    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'

    import { computed, ref } from 'vue'

    import { useRoute } from 'vue-router'

    import { getClub } from '@/graphql/queries/teams/getClub.js'

    import { useBreakpoints } from '@vueuse/core'
    import { twBreakpoints } from '@/tailwind'

    const breakpoints = useBreakpoints(twBreakpoints)
    const md = breakpoints.greater('md')
    // import { useClubsStore } from '@/store/clubs.store'
    // import { isPositiveInteger } from '@/utils/stringUtils'

    const route = useRoute()
    // const clubs = useClubsStore()

    // const clubId = computed(() => route.params.clubId)
    const clubRoute = computed(() => `/club/${route.params.clubId}`)
    const clubManageRoute = computed(() => `/club/${route.params.clubId}/manage`)

    // const club = ref(null)

    const HOME = 'home'
    const REQUESTS = 'requests'
    const MEMBERS = 'members'
    const DRIVE = 'drive'
    const ACTIVITY = 'activity'
    const TREASURY = 'treasury'

    const tabs = [
        {
            id: HOME,
            name: 'Accueil',
            route: clubManageRoute,
            icon: 'house',
        },
        {
            id: MEMBERS,
            name: 'Membres',
            icon: 'users',
        },
        {
            id: REQUESTS,
            name: "Demandes d'adhésion",
            icon: 'envelope',
        },
        {
            id: DRIVE,
            name: 'Documents',
            icon: 'file-arrow-down',
        },
        {
            id: ACTIVITY,
            name: 'Événements',
            icon: 'calendar',
        },
        {
            id: TREASURY,
            name: 'Trésorerie',
            icon: 'sack-dollar',
        },
    ]
    const DEFAULT_TAB = tabs[0]

    const currentTab = ref(null)

    // await clubs.getClub(clubId.value).then((data) => (club.value = data))

    const components = {
        [HOME]: ManageHomepage,
        [REQUESTS]: ManageRequestsAsync,
        [DRIVE]: ManageDriveAsync,
        [MEMBERS]: ClubMembers,
        [ACTIVITY]: ManageActivityAsync,
        [TREASURY]: WIP,
    }
    const currentComponent = computed(() => components[currentTab.value ?? DEFAULT_TAB.id])

    // watchEffect(async () => {
    //     if (isPositiveInteger(clubId.value)) {
    //         await clubs.getClub(clubId.value).then((data) => (club.value = data))
    //     }
    // })
</script>
