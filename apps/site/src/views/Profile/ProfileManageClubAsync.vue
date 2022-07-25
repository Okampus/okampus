<template>
    <div class="relative flex flex-col">
        <div class="bg-2 text-0">
            <div class="centered-container-padded sticky top-0 z-30 flex flex-col pb-0">
                <div class="flex items-center justify-between gap-4 pt-4">
                    <div class="flex items-center gap-4">
                        <ProfileAvatar
                            :avatar="club.avatar"
                            :name="club.name"
                            :size="3"
                            :rounded-full="false"
                        />
                        <div class="text-2xl">{{ club.name }}</div>
                        <LabelSimple class="cursor-default bg-slate-600/40 hover:bg-slate-600/40">
                            Vue administrateur
                        </LabelSimple>
                    </div>
                    <router-link :to="`/club/${clubId}`" class="hidden text-lg text-blue-500 md:block">
                        Voir en tant que visiteur
                    </router-link>
                    <router-link :to="`/club/${clubId}`" class="text-lg text-blue-500 md:hidden">
                        Vue visiteur
                    </router-link>
                </div>
                <HorizontalTabs
                    v-model="currentTab"
                    :tabs="tabs"
                    :route-base="clubManageRoute"
                    route-name="manage-club"
                />
            </div>
        </div>
        <div class="centered-container-padded flex flex-col">
            <Transition mode="out-in" name="switch-fade">
                <KeepAlive>
                    <Suspense timeout="0">
                        <component :is="currentComponent" v-model:club="club" />
                        <template #fallback>
                            <AppLoader />
                        </template>
                    </Suspense>
                </KeepAlive>
            </Transition>
        </div>
    </div>
</template>

<script setup>
    import WIP from '@/views/App/WIP.vue'

    import ManageHomepage from '@/components/Profile/Manage/ManageHomepage.vue'
    import ManageRequestsAsync from '@/components/Profile/Manage/ManageRequestsAsync.vue'
    import ManageDriveAsync from '@/components/Profile/Manage/ManageDriveAsync.vue'
    import ManageActivityAsync from '@/components/Profile/Manage/ManageActivityAsync.vue'

    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'
    import AppLoader from '@/components/App/AppLoader.vue'

    import { computed, ref, watchEffect } from 'vue'

    import { useRoute } from 'vue-router'
    import { useClubsStore } from '@/store/clubs.store'
    import { isPositiveInteger } from '@/utils/stringUtils'

    import ClubMembersAsync from '@/components/Profile/Club/ClubMembersAsync.vue'

    const route = useRoute()
    const clubs = useClubsStore()

    const clubId = computed(() => route.params.clubId)
    const clubManageRoute = computed(() => `/club/${route.params.clubId}/manage`)

    const club = ref(null)

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
            name: 'Documents légaux',
            icon: 'file-arrow-down',
        },
        {
            id: ACTIVITY,
            name: 'Events',
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

    await clubs.getClub(clubId.value).then((data) => (club.value = data))

    const components = {
        [HOME]: ManageHomepage,
        [REQUESTS]: ManageRequestsAsync,
        [DRIVE]: ManageDriveAsync,
        [MEMBERS]: ClubMembersAsync,
        [ACTIVITY]: ManageActivityAsync,
        [TREASURY]: WIP,
    }
    const currentComponent = computed(() => components[currentTab.value ?? DEFAULT_TAB.id])

    watchEffect(async () => {
        if (isPositiveInteger(clubId.value)) {
            await clubs.getClub(clubId.value).then((data) => (club.value = data))
        }
    })
</script>
