<template>
    <div class="flex flex-col gap-6">
        <div class="bg-2 text-0">
            <div class="flex flex-col px-4 w-full max-w-6xl md:gap-8 xl:mx-auto">
                <div class="flex gap-4 justify-between items-center py-4">
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
        <div class="flex flex-col px-4 w-full max-w-6xl md:gap-8 xl:mx-auto">
            <keep-alive>
                <component :is="currentComponent" v-model:club="club" />
            </keep-alive>
        </div>
    </div>
</template>

<script setup>
    import ManageHomepage from '@/components/Profile/Manage/ManageHomepage.vue'
    import WIP from '@/views/App/WIP.vue'

    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'

    import { computed, h, ref, watchEffect } from 'vue'

    import { useRoute } from 'vue-router'
    import { useClubsStore } from '@/store/clubs.store'
    import { isPositiveInteger } from '@/utils/stringUtils'

    const route = useRoute()
    const clubs = useClubsStore()

    const clubId = computed(() => route.params.clubId)
    const clubManageRoute = computed(() => `/club/${route.params.clubId}/manage`)

    const club = ref(null)

    const HOME = 'home'
    const REQUESTS = 'requests'
    const MEMBERS = 'members'
    const ACTIVITY = 'activity'
    const SETTINGS = 'settings'

    const tabs = [
        {
            id: HOME,
            name: "Vue d'accueil",
            route: clubManageRoute,
            icon: 'house',
        },
        {
            id: REQUESTS,
            name: "Demandes d'adhésion",
            icon: 'envelope',
        },
        {
            id: MEMBERS,
            name: 'Membres',
            icon: 'users',
        },
        {
            id: ACTIVITY,
            name: 'Activité',
            icon: 'history',
        },
        {
            id: SETTINGS,
            name: 'Paramètres',
            icon: 'cog',
        },
    ]
    const DEFAULT_TAB = tabs[0]

    const currentTab = ref(null)

    await clubs.getClub(clubId.value).then((data) => (club.value = data))

    const components = {
        [HOME]: ManageHomepage,
        [REQUESTS]: h(WIP, { key: REQUESTS }),
        [MEMBERS]: h(WIP, { key: MEMBERS }),
        [ACTIVITY]: h(WIP, { key: ACTIVITY }),
        [SETTINGS]: h(WIP, { key: SETTINGS }),
    }
    const currentComponent = computed(() => components[currentTab.value ?? DEFAULT_TAB.id])

    watchEffect(async () => {
        if (isPositiveInteger(clubId.value)) {
            await clubs.getClub(clubId.value).then((data) => (club.value = data))
        }
    })
</script>
