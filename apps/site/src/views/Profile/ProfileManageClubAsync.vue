<template>
    <div class="flex relative flex-col">
        <div class="bg-2 text-0">
            <div class="flex sticky top-0 z-30 flex-col pb-0 centered-container">
                <div class="flex gap-4 justify-between items-center pt-4">
                    <div class="flex gap-4 items-center">
                        <ProfileAvatar
                            :avatar="club.avatar"
                            :name="club.name"
                            :size="3"
                            :rounded-full="false"
                        />
                        <div class="text-2xl">{{ club.name }}</div>
                        <LabelSimple class="bg-slate-600/40 hover:bg-slate-600/40 cursor-default">
                            Vue administrateur
                        </LabelSimple>
                    </div>
                    <router-link :to="`/club/${clubId}`" class="text-lg text-blue-500">
                        Voir en tant que visiteur
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
        <div class="flex flex-col centered-container">
            <!-- <keep-alive> -->
            <component :is="currentComponent" :key="club" v-model:club="club" />
            <!-- </keep-alive> -->
        </div>
    </div>
</template>

<script setup>
    import ManageHomepage from '@/components/Profile/Manage/ManageHomepage.vue'
    import ManageRequests from '@/components/Profile/Manage/ManageRequests.vue'
    import ManageDrive from '@/components/Profile/Manage/ManageDrive.vue'

    import ManageActivity from '@/components/Profile/Manage/ManageActivity.vue'

    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'

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
    ]
    const DEFAULT_TAB = tabs[0]

    const currentTab = ref(null)

    await clubs.getClub(clubId.value).then((data) => (club.value = data))

    const components = {
        [HOME]: ManageHomepage,
        [REQUESTS]: ManageRequests,
        [DRIVE]: ManageDrive,
        [MEMBERS]: ClubMembersAsync,
        [ACTIVITY]: ManageActivity,
    }
    const currentComponent = computed(() => components[currentTab.value ?? DEFAULT_TAB.id])

    watchEffect(async () => {
        if (isPositiveInteger(clubId.value)) {
            await clubs.getClub(clubId.value).then((data) => (club.value = data))
        }
    })
</script>
