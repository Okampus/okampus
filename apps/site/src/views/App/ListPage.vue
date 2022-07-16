<template>
    <Transition mode="out-in" name="switch-fade">
        <Suspense timeout="0">
            <template #default>
                <ListPageAsync :route-base="routeBase" :route-name="routeName" :callback="callback">
                    <template #default="{ items }">
                        <slot v-if="items.length" :items="items" />
                        <div v-else class="text-center text-0">
                            <EmojiSad class="my-3 text-3xl" />
                            <div class="text-2xl font-bold">
                                Aucun{{ resource.frFeminine ? 'e' : '' }} {{ resource.name.fr }} ne correspond
                                à ces critères.
                            </div>
                            <div class="text-lg">
                                Essayez la
                                <router-link :to="routeBase" class="link-blue"
                                    >liste de tou{{ resource.frFeminine ? 'te' : '' }}s les
                                    {{ resource.name.fr }}s</router-link
                                >.
                            </div>
                        </div>
                    </template>
                </ListPageAsync>
            </template>

            <template #fallback>
                <AppLoader />
            </template>
        </Suspense>
    </Transition>
</template>

<script setup>
    import ListPageAsync from '@/views/App/ListPageAsync.vue'
    import AppLoader from '@/components/App/AppLoader.vue'
    import EmojiSad from '@/icons/Emoji/EmojiSad.vue'

    import { RESOURCE_NAMES, DEFAULT } from '@/shared/types/resource-names.enum'

    const props = defineProps({
        type: {
            type: String,
            required: true,
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

    const resource = RESOURCE_NAMES?.[props.type] ?? RESOURCE_NAMES[DEFAULT]
</script>
