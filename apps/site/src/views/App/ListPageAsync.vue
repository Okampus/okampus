<template>
    <div class="flex flex-col">
        <slot :items="results.items" />
        <PageFooter
            :route-base="routeBase"
            :current-page="query.page"
            :total-pages="results.totalPages"
            :items-per-page="query.itemsPerPage"
            :total-item-count="results.totalItemCount"
            class="mb-20"
        />
    </div>
</template>

<script setup>
    import PageFooter from '@/components/Pagination/PageFooter.vue'

    import { useRoute, useRouter } from 'vue-router'
    import { reactive, watch } from 'vue'

    import { emitter } from '@/shared/modules/emitter'
    import { isPositiveInteger } from '@/utils/stringUtils'

    import { isNil } from 'lodash'
    import { getStatusAxiosError } from '@/utils/errors'
    import { showWarningToast } from '@/utils/toast.js'

    const query = reactive({
        page: 1,
        itemsPerPage: 12,
        sortBy: null,
    })

    const results = reactive({
        items: [],
        totalPages: 0,
        totalItemCount: 0,
    })

    const props = defineProps({
        sortTypes: {
            type: Array,
            default: () => [],
        },
        routeBase: {
            type: String,
            required: true,
        },
        routeName: {
            type: String,
            default: null,
        },
        callback: {
            type: Function,
            required: true,
        },
    })

    const route = useRoute()
    const router = useRouter()

    const getPageAndQuery = async () => {
        if (route.name === props.routeName || route.path === props.routeBase) {
            const queryPage = isNil(route.query?.page) ? '1' : route.query?.page

            if (!isPositiveInteger(queryPage)) {
                showWarningToast(`La page '${queryPage}' n'existe pas. Redirection sur la page 1 ↪️`, {
                    duration: 5000,
                })
                router.push(props.routeBase)
                return
            }

            query.page = parseInt(queryPage)

            await props
                .callback(query)
                .then(({ items, pageInfo }) => {
                    if (!items.length && query.page > 1) {
                        showWarningToast(`La page '${queryPage}' est vide. Redirection sur la page 1 ↪️`, {
                            duration: 5000,
                        })
                        router.push(props.routeBase)
                    } else {
                        results.items = items
                        results.totalPages = pageInfo.totalPages
                        results.totalItemCount = pageInfo.totalItemCount
                    }
                })
                .catch((err) => {
                    emitter.emit('error-route', { code: getStatusAxiosError(err) })
                })
        }
    }

    await getPageAndQuery()
    watch(() => route.query, getPageAndQuery)
</script>
