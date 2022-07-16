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

        <Transition mode="out-in" name="switch-fade">
            <KeepAlive>
                <Suspense timeout="0">
                    <component :is="components[currentTab]" />
                    <template #fallback>
                        <AppLoader />
                    </template>
                </Suspense>
            </KeepAlive>
        </Transition>
    </div>
</template>

<script setup>
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import DashboardOverviewAsync from '@/components/Dashboard/DashboardOverviewAsync.vue'
    import DashboardClubsAsync from '@/components/Dashboard/DashboardClubsAsync.vue'
    import DashboardReportAsync from '@/components/Dashboard/DashboardReportAsync.vue'

    import AppLoader from '@/components/App/AppLoader.vue'

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
        [OVERVIEW]: DashboardOverviewAsync,
        [CLUBS]: DashboardClubsAsync,
        [REPORTS]: DashboardReportAsync,
    }
</script>
