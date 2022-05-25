<template>
    <div class="flex gap-4 my-6 mx-4 max-w-6xl md:gap-8 xl:mx-auto">
        <VerticalTabs
            v-model="currentTab"
            :tabs="tabs"
            :base-route="`/${BASE_ROUTE}`"
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

    const THREADS = 0

    const tabs = ref([
        {
            id: 'threads',
            route: '/search',
            name: 'Threads',
        },
        {
            id: 'users',
            name: 'Users',
        },
    ])

    const searchables = {
        threads: { component: ThreadList },
        users: { component: UserList },
    }

    const currentTab = ref(null)
    const currentComponent = computed(() => searchables[currentTab.value ?? tabs.value[THREADS].id].component)
</script>
