<template>
    <Suspense>
        <template #default>
            <ListPageAsync :base-route="baseRoute" :store-callback="storeCallback">
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
    })
</script>
