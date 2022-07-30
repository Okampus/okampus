<template>
    <ApolloQuery :query="query" :variables="variables" :update="update">
        <template #default="{ result: { error, data }, isLoading }">
            <AppLoader v-if="isLoading" :size="loaderSize" />

            <AppException v-else-if="error" :code="getGraphQLErrorCode(error)" />

            <slot v-else-if="data && (!Array.isArray(data) || data?.length > 0)" :data="data" />

            <div v-else-if="resource" class="text-0 text-center">
                <EmojiSad class="my-3 text-3xl" />
                <div class="text-2xl font-bold">
                    Aucun{{ resource.frFeminine ? 'e' : '' }} {{ resource.name.fr }} ne correspond à ces
                    critères.
                </div>
                <div v-if="routeBase" class="text-lg">
                    Essayez la
                    <router-link :to="routeBase" class="link-blue"
                        >liste de tou{{ resource.frFeminine ? 'te' : '' }}s les
                        {{ resource.name.fr }}s</router-link
                    >.
                </div>
            </div>
        </template>
    </ApolloQuery>
</template>

<script setup>
    import { ApolloQuery } from '@vue/apollo-components'
    import { getGraphQLErrorCode } from '@/utils/errors'

    import AppException from '@/views/App/AppException.vue'
    import AppLoader from '@/components/App/AppLoader.vue'
    import EmojiSad from '@/icons/Emoji/EmojiSad.vue'
    import { DEFAULT, RESOURCE_NAMES } from '@/shared/types/resource-names.enum'

    const props = defineProps({
        query: {
            type: [Object, Function],
            required: true,
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
            default: '',
        },
        routeBase: {
            type: String,
            default: '',
        },
    })

    const resource = RESOURCE_NAMES?.[props.resourceType] ?? RESOURCE_NAMES[DEFAULT]
</script>
