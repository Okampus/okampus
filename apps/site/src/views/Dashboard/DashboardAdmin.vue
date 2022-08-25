<template>
    <GraphQLQuery
        :query="getConfig"
        :variables="{ id: getTenant() }"
        :update="(data) => data?.tenantById"
        :whole-page="true"
    >
        <template #default="{ data: config }">
            <div class="centered-container flex h-full flex-col gap-0">
                <HorizontalTabs
                    v-model="currentTab"
                    :tabs="config.userValidations.length ? tabs : tabs.filter((t) => t.id !== EVENTS)"
                    route-base="/admin"
                    route-name="admin"
                    class="mb-4"
                />

                <Transition mode="out-in" name="switch-fade">
                    <component :is="components[currentTab]" :config="config" />
                </Transition>
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'

    import DashboardOverview from '@/components/Dashboard/DashboardOverview.vue'
    import DashboardClubs from '@/components/Dashboard/DashboardClubs.vue'
    import DashboardReports from '@/components/Dashboard/DashboardReports.vue'
    import DashboardEvents from '@/components/Dashboard/DashboardEvents.vue'
    import DashboardConfig from '@/components/Dashboard/DashboardConfig.vue'

    import { getConfig } from '@/graphql/queries/config/getConfig'
    import { getTenant } from '@/utils/getTenant'

    import { ref } from 'vue'

    const OVERVIEW = 'overview'
    const CLUBS = 'clubs'
    const REPORTS = 'reports'
    const EVENTS = 'events'
    const CONFIG = 'config'

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
        {
            id: EVENTS,
            name: 'Événements',
            icon: 'calendar-check',
        },
        {
            id: CONFIG,
            name: 'Configuration',
            icon: 'cog',
        },
    ]

    const currentTab = ref(null)
    const components = {
        [OVERVIEW]: DashboardOverview,
        [CLUBS]: DashboardClubs,
        [REPORTS]: DashboardReports,
        [EVENTS]: DashboardEvents,
        [CONFIG]: DashboardConfig,
    }
</script>
