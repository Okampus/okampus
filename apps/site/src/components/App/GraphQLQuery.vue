<template>
    <ApolloQuery
        :debounce="debounce"
        :query="query"
        :variables="variables"
        :update="update"
        :class="{ 'h-full': wholePage }"
    >
        <template #default="{ result: { error, data }, isLoading, query: q }">
            <slot name="include" :data="data" :query="q" />
            <AppLoader v-if="isLoading" :size="loaderSize" :whole-page="wholePage" />

            <slot v-else-if="error && $slots.error" :code="getGraphQLErrorCode(error)" />
            <AppException v-else-if="error" :code="getGraphQLErrorCode(error)" :whole-page="wholePage" />

            <slot
                v-else-if="hideEmpty || (data && (!Array.isArray(data) || data?.length > 0))"
                :data="data"
                :query="q"
            />

            <slot v-else-if="$slots.empty" name="empty" />
            <div
                v-else-if="resource"
                class="text-0 my-12 flex flex-col items-center justify-center gap-4"
                :class="{ 'h-full -mt-6': wholePage }"
            >
                <img :src="Sleeping" :class="wholePage ? 'h-48 w-48' : 'h-36 w-36'" />
                <div class="text-center">
                    <div v-if="resourceType" class="font-bold" :class="wholePage ? 'text-4xl' : 'text-2xl'">
                        Aucun{{ resource.frFeminine ? 'e' : '' }} {{ resource.name.fr }} trouvé{{
                            resource.frFeminine ? 'e' : ''
                        }}
                    </div>
                    <div v-else class="font-bold" :class="wholePage ? 'text-4xl' : 'text-2xl'">
                        Aucun résultat
                    </div>
                    <div v-if="emptySubtitle" :class="wholePage ? 'text-lg' : 'text-base'" class="text-2">
                        {{ emptySubtitle }}
                    </div>
                    <div
                        v-else-if="routeBase && route.fullPath !== routeBase"
                        :class="wholePage ? 'text-lg' : 'text-base'"
                        class="text-2"
                    >
                        Essayez la
                        <router-link :to="routeBase" class="link-blue"
                            >liste de tou{{ resource.frFeminine ? 'te' : '' }}s les
                            {{ resource.name.fr }}s</router-link
                        >.
                    </div>
                </div>
            </div>
        </template>
    </ApolloQuery>
</template>

<script setup>
    import Sleeping from '@/assets/img/3dicons/sleeping.png'

    import { ApolloQuery } from '@vue/apollo-components'

    import AppException from '@/views/App/AppException.vue'
    import AppLoader from '@/components/App/AppLoader.vue'

    import { getGraphQLErrorCode } from '@/utils/errors'
    import { DEFAULT, RESOURCE_NAMES } from '@/shared/types/resource-names.enum'

    import { useRoute } from 'vue-router'

    const route = useRoute()

    const props = defineProps({
        query: {
            type: [Object, Function],
            required: true,
        },
        hideEmpty: {
            type: Boolean,
            default: false,
        },
        emptySubtitle: {
            type: String,
            default: '',
        },
        debounce: {
            type: Number,
            default: 0,
        },
        loaderSize: {
            type: Number,
            default: 3.5,
        },
        variables: {
            type: Object,
            default: () => ({}),
        },
        update: {
            type: Function,
            required: true,
        },
        resourceType: {
            type: String,
            default: null,
        },
        routeBase: {
            type: String,
            default: '',
        },
        wholePage: {
            type: Boolean,
            default: false,
        },
    })

    if (import.meta.env.DEV) console.log('[GraphQL Query]', props.query, ' ~ variables', props.variables)

    const resource = RESOURCE_NAMES?.[props.resourceType] ?? RESOURCE_NAMES[DEFAULT]
</script>
