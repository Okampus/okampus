<template>
    <div class="flex flex-col">
        <SelectInput v-if="sortTypes.length" />
        <slot :items="results.items" />
        <PageFooter
            :route-base="routeBase"
            :current-page="query.page"
            :total-pages="results.totalPages"
            :items-per-page="query.itemsPerPage"
            :total-item-count="results.totalItemCount"
        />
    </div>
</template>

<script setup>
    import SelectInput from '@/components/Input/SelectInput.vue'
    import PageFooter from '@/components/Pagination/PageFooter.vue'

    import { useRoute, useRouter } from 'vue-router'
    import { reactive, watch } from 'vue'

    import { emitter } from '@/shared/modules/emitter'
    import { isPositiveInteger } from '@/utils/stringUtils'

    import { isNil } from 'lodash'
    import { getStatusAxiosError } from '@/utils/errors'

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
                emitter.emit('show-toast', {
                    message: `La page '${queryPage}' n'existe pas. Redirection sur la page 1 ↪️`,
                    type: 'warning',
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
                        emitter.emit('show-toast', {
                            message: `La page ${props.page} est vide. Redirection sur la page 1 ↪️`,
                            type: 'info',
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
