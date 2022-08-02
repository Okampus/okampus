<template>
    <div class="centered-container flex-col gap-4">
        <HorizontalTabs v-model="currentTab" :tabs="tabs" route-base="/admin" route-name="admin" />

        <Transition mode="out-in" name="switch-fade">
            <component :is="components[currentTab]" />
        </Transition>
    </div>
</template>

<script setup>
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import DashboardOverview from '@/components/Dashboard/DashboardOverview.vue'
    import DashboardClubs from '@/components/Dashboard/DashboardClubs.vue'
    import DashboardReports from '@/components/Dashboard/DashboardReports.vue'

    // import AppLoader from '@/components/App/AppLoader.vue'

    import { ref } from 'vue'

    const OVERVIEW = 'overview'
    const CLUBS = 'clubs'
    const REPORTS = 'reports'

    // TODO: router: redirect unknown tabs to 404
    // TODO: add tab for user (and tabs for other contents)
    const tabs = [
        {
            id: OVERVIEW,
            name: "Vue d'ensemble",
            icon: 'chart-bar',
        },
        {
            id: CLUBS,
            name: 'Associations',
            icon: 'users',
        },
        {
            id: REPORTS,
            name: 'Signalements',
            icon: 'flag',
        },
    ]

    const currentTab = ref(OVERVIEW)
    const components = {
        [OVERVIEW]: DashboardOverview,
        [CLUBS]: DashboardClubs,
        [REPORTS]: DashboardReports,
    }
</script>
