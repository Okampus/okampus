<template>
    <div class="flex gap-4 my-6 mx-4 max-w-6xl md:gap-8 xl:mx-auto">
        <VerticalTabs
            v-model="currentTab"
            :tabs="tabs"
            :route-base="`/${BASE_ROUTE}`"
            :route-name="ROUTE_NAME"
            class="sticky top-6"
        />
        <div class="justify-center w-full">
            <keep-alive>
                <component
                    :is="currentComponent"
                    :route-name="ROUTE_NAME"
                    :route-base="`/${BASE_ROUTE}/${currentTab}`"
                />
            </keep-alive>
        </div>
    </div>
</template>

<script setup>
    import { computed, ref } from 'vue'

    import ThreadList from '@/views/List/ThreadList.vue'
    import UserList from '@/views/List/UserList.vue'
    import VerticalTabs from '@/components/UI/Tabs/VerticalTabs.vue'

    const BASE_ROUTE = 'search'
    const ROUTE_NAME = 'search'

    const THREADS = 'threads'
    const USERS = 'users'

    const tabs = [
        {
            id: THREADS,
            route: '/search',
            name: 'Posts',
        },
        {
            id: USERS,
            name: 'Utilisateurs',
        },
    ]

    const DEFAULT_TAB = tabs[0]

    const components = {
        [THREADS]: ThreadList,
        [USERS]: UserList,
    }

    const currentTab = ref(null)
    const currentComponent = computed(() => components[currentTab.value ?? DEFAULT_TAB.id])
</script>
