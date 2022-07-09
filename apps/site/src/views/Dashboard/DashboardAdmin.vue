<template>
    <div class="flex flex-col gap-4 my-4 mx-auto w-23/24">
        <HorizontalTabs
            v-model="currentTab"
            class="border-b"
            :tabs="tabs"
            route-base="/admin"
            route-name="admin"
        >
        </HorizontalTabs>
        <component :is="components[currentTab]"></component>
    </div>
</template>

<script setup>
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import DashboardOverview from '@/components/Dashboard/DashboardOverview.vue'
    import DashboardClubs from '@/components/Dashboard/DashboardClubs.vue'
    import DashboardReport from '@/components/Dashboard/DashboardReport.vue'
    import { ref } from 'vue'
    import { useReportsStore } from '@/store/reports.store'

    // TODO: router: redirect unknown tabs to 404
    // TODO: add tab for user (and tabs for other contents)
    const tabs = [
        {
            id: 'overview',
            name: "Vue d'ensemble",
            icon: 'chart-bar',
        },
        { id: 'clubs', name: 'Associations', icon: 'users' },
        {
            id: 'reports',
            name: 'Signalements',
            icon: 'flag',
        },
    ]

    const currentTab = ref('overview')
    const components = { 'overview': DashboardOverview, 'clubs': DashboardClubs, 'reports': DashboardReport }

    const reports = useReportsStore()

    reports.getReports({ page: 1 })
</script>
