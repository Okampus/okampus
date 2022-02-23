<template>
    <Suspense>
        <template #default>
            <ListPageAsync
                :base-route="baseRoute"
                :store-callback="storeCallback"
                :store-getter="storeGetter"
            >
                <template #default="{ items }">
                    <slot :items="items" />
                </template>
            </ListPageAsync>
        </template>

        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import ListPageAsync from '@/views/App/ListPageAsync.vue'
    import AppLoader from '@/components/App/AppLoader.vue'
    import { NOOP } from '@vue/shared'

    defineProps({
        sortTypes: {
            type: Array,
            default: () => [],
        },
        baseRoute: {
            type: String,
            required: true,
        },
        storeCallback: {
            type: Function,
            required: true,
        },
        storeGetter: {
            type: Function,
            default: NOOP,
        },
    })
</script>
