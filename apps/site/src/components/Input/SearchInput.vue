<template>
    <ais-instant-search
        :search-client="typesenseInstantsearchAdapter?.searchClient ?? (() => {})"
        :index-name="indexName"
        class="relative w-full h-full"
        @keydown.arrow-up.exact="indexSelected == null && focusInput ? (indexSelected = -1) : indexSelected--"
        @keydown.arrow-down.exact="
            indexSelected == null && focusInput ? (indexSelected = 0) : indexSelected++
        "
    >
        <div class="flex flex-col w-full h-full">
            <Popper class="search-input-global" offset-distance="0" :show="focusInput">
                <ais-search-box class="w-full h-full">
                    <template #default="{ isSearchStalled, refine }">
                        <div
                            class="flex items-center w-full h-full cursor-pointer input"
                            @click.prevent="focusSearchbar"
                        >
                            <slot
                                v-for="item in modelValue"
                                name="inputComponent"
                                :item="item"
                                :delete-item="deleteItem"
                            />
                            <!-- IMPORTANT :value="currentRefinement" -->
                            <input
                                v-if="modelValue.length != itemLimit"
                                ref="input"
                                class="grow h-full bg-transparent outline-none"
                                :placeholder="
                                    modelValue.length == 0 ? 'Rechercher une ressource sur Okampus...' : ''
                                "
                                type="search"
                                @input="refine($event.currentTarget.value), (indexSelected = null)"
                                @focusin="focusInput = true"
                                @focusout="focusInput = false"
                            />
                        </div>
                        <span :hidden="!isSearchStalled">Chargement...</span>
                    </template>
                </ais-search-box>

                <template #content="{ close }">
                    <div class="overflow-y-scroll p-2 rounded-b-lg border border-t-0 shadow-lg bg-1">
                        <ais-index :index-name="indexName">
                            <ais-hits class="flex flex-col gap-2 w-full">
                                <template #default="{ items }">
                                    <div v-if="items.length != 0">
                                        <slot
                                            :index-selected="indexSelected"
                                            :key-enter="keyEnter"
                                            :items="items"
                                            :add-item="addItem"
                                            @click="close"
                                        />
                                    </div>
                                    <div v-else class="flex flex-col gap-2 justify-center items-center h-24">
                                        <EmojiSad />
                                        <div class="">Pas de résultat ...</div>
                                    </div>
                                </template>
                            </ais-hits>
                        </ais-index>
                    </div>
                </template>
            </Popper>
        </div>
    </ais-instant-search>
</template>

<script setup>
    import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
    import Popper from 'vue3-popper'
    import EmojiSad from '@/icons/Emoji/EmojiSad.vue'
    import $typesense from '@/shared/config/typesense.config'
    import { computed, ref } from 'vue'

    const props = defineProps({
        indexObject: {
            type: Object,
            required: true,
        },
        modelValue: {
            type: Array,
            required: true,
        },
        itemLimit: {
            type: Number,
            default: 0,
        },
    })

    const emit = defineEmits(['update:modelValue'])

    const input = ref(null)

    const keyEnter = ref(false)
    const focusInput = ref(false)
    const indexSelected = ref(null)

    const indexName = computed(() => Object.getOwnPropertyNames(props.indexObject)[0])
    const typesenseInstantsearchAdapter = computed(
        () =>
            new TypesenseInstantSearchAdapter({
                ...$typesense,
                additionalSearchParameters: {
                    limit_hits: 10,
                    per_page: 10,
                },
                collectionSpecificSearchParameters: props.indexObject,
            }),
    )

    const focusSearchbar = () => {
        if (props.modelValue.length !== props.itemLimit) this.input.value.focus()
    }

    const addItem = (item) => {
        emit('update:modelValue', [
            ...(props.modelValue.length === props.itemLimit
                ? [...props.modelValue.slice(1), item]
                : [...props.modelValue, item]),
            item,
        ])
        this.input.value.focus()
        this.input.value.value = ''
    }

    const deleteItem = (item) => {
        emit(
            'update:modelValue',
            props.modelValue.filter((i) => i !== item),
        )
    }
</script>

<style lang="scss">
    .search-input-global > .popper {
        @apply w-full;
    }
</style>
