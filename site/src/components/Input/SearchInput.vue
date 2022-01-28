/* eslint-disable */
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
            <Popper class="search-input-global" :offset-distance="'0'" :show="focusInput">
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
                                :deleteItem="deleteItem"
                            />
                            <!-- IMPORTANT :value="currentRefinement" -->
                            <input
                                v-if="modelValue.length != itemLimit"
                                ref="input"
                                class="grow h-full bg-transparent outline-none"
                                :placeholder="
                                    modelValue.length == 0
                                        ? 'Rechercher une ressource sur Horizon Efrei...'
                                        : ''
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
                                            :indexSelected="indexSelected"
                                            :keyEnter="keyEnter"
                                            :items="items"
                                            :addItem="addItem"
                                            @click="close"
                                        />
                                    </div>
                                    <div v-else class="flex flex-col gap-2 justify-center items-center h-24">
                                        <AppEmoji
                                            :="sadFaces[Math.floor(Math.random() * (sadFaces.length - 1))]"
                                        />
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

<script>
    import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
    import Popper from 'vue3-popper'
    import AppEmoji from '../App/AppEmoji.vue'

    export default {
        components: {
            AppEmoji,
            Popper,
        },
        props: {
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
                default() {
                    return 0
                },
            },
        },
        emits: ['update:modelValue'],
        data() {
            return {
                keyEnter: false,
                focusInput: false,
                indexSelected: null,
                sadFaces: [
                    {
                        emoji: ':(',
                        type: 'text',
                    },
                    {
                        emoji: ':|',
                        type: 'text',
                    },
                    {
                        emoji: ':\\',
                        type: 'text',
                    },
                    {
                        emoji: ':c',
                        type: 'text',
                    },
                    {
                        emoji: ':ꓷ',
                        type: 'text',
                    },
                    {
                        emoji: ':[',
                        type: 'text',
                    },
                    {
                        emoji: 'grimace',
                        type: 'icon',
                    },
                    {
                        emoji: 'sad-cry',
                        type: 'icon',
                    },
                    {
                        emoji: 'grin-beam-sweat',
                        type: 'icon',
                    },
                    {
                        emoji: 'dizzy',
                        type: 'icon',
                    },
                    {
                        emoji: 'surprise',
                        type: 'icon',
                    },
                ],
                Math,
            }
        },
        computed: {
            indexName() {
                return Object.getOwnPropertyNames(this.indexObject)[0]
            },
            typesenseInstantsearchAdapter() {
                console.log(import.meta.env.VITE_TYPESENSE_HOST + ':' + import.meta.env.VITE_TYPESENSE_PORT)
                return new TypesenseInstantSearchAdapter({
                    server: {
                        apiKey: import.meta.env.VITE_TYPESENSE_API_KEY,
                        nodes: [
                            {
                                host: import.meta.env.VITE_TYPESENSE_HOST,
                                port: import.meta.env.VITE_TYPESENSE_PORT,
                                protocol: import.meta.env.VITE_TYPESENSE_SCHEME,
                            },
                        ],
                    },
                    cacheSearchResultsForSeconds: 2 * 60,
                    additionalSearchParameters: {
                        limit_hits: 10,
                        per_page: 10,
                    },
                    collectionSpecificSearchParameters: this.indexObject,
                })
            },
        },
        methods: {
            focusSearchbar() {
                this.showSearchBar = true
                if (this.modelValue.length != this.itemLimit) {
                    this.$refs.input.focus()
                }
            },
            addItem(item) {
                this.$refs.input.value = ''
                this.$refs.input.focus()
                const temp = this.modelValue
                if (temp.length == this.itemLimit) {
                    temp.shift()
                }
                temp.push(item)
                this.$emit('update:modelValue', temp)
            },
            deleteItem(item) {
                const temp = this.modelValue
                temp.pop(item)
                this.$emit('update:modelValue', temp)
            },
        },
    }
</script>

<style lang="scss">
    .search-input-global > .popper {
        @apply w-full;
    }
</style>
