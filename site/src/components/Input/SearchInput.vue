/* eslint-disable */
<template>
    <ais-instant-search
        :search-client="typesenseInstantsearchAdapter?.searchClient ?? (() => {})"
        :index-name="indexName"
        class="h-full relative w-full"
        @keydown.arrow-up.exact="indexSelected == null && focusInput? indexSelected = -1 : indexSelected--"
        @keydown.arrow-down.exact="indexSelected == null && focusInput? indexSelected = 0 : indexSelected++"
        @keydown.enter.exact="keyEnter = true"
    >
        <div
            class="h-full w-full flex flex-col"
        >
            <v-popper
                class="search-input-global"
                :offset-distance="'0'"
                :show="focusInput"
            >
                <ais-search-box
                    class="w-full h-full"
                >
                    <template #default="{ isSearchStalled, refine }">
                        <div

                            class="input w-full h-full flex items-center cursor-pointer"
                            @click.prevent="showSearchBar = true, modelValue.length != itemLimit ? $refs.input.focus():null"
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
                                class="flex-grow h-full bg-transparent outline-none"
                                :placeholder="modelValue.length == 0 ? 'Rechercher une ressource sur Horizon Efrei...':''"
                                type="search"
                                @input="refine($event.currentTarget.value), indexSelected=null"
                                @focusin="focusInput = true"
                                @focusout="focusInput = false"
                            >
                        </div>
                        <span :hidden="!isSearchStalled">Chargement...</span>
                    </template>
                </ais-search-box>

                <template #content="{ close }">
                    <div class="p-2 overflow-y-scroll border border-t-0 rounded-b-lg bg-1 shadow-lg">
                        <ais-index
                            :index-name="indexName"
                        >
                            <ais-hits class="w-full flex flex-col gap-2">
                                <template
                                    #default="{ items }"
                                >
                                    <div
                                        v-if="items.length != 0"
                                    >
                                        <slot
                                            :indexSelected="indexSelected"
                                            :keyEnter="keyEnter"
                                            :items="items"
                                            :addItem="addItem"
                                            @click="close"
                                        />
                                    </div>
                                    <div
                                        v-else
                                        class="h-24 flex flex-col justify-center items-center gap-2"
                                    >
                                        <div
                                            class="text-xl h-1/2 flex items-center"
                                            v-html="sadFaces[Math.floor(Math.random() * sadFaces.length)]"
                                        />
                                        <div class="">
                                            Pas de résultat ...
                                        </div>
                                    </div>
                                </template>
                            </ais-hits>
                        </ais-index>
                    </div>
                </template>
            </v-popper>
        </div>
    </ais-instant-search>
</template>

<script>

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

export default {
    components:{

    },
    props:{
        indexObject:{
            type: Object,
            required:true
        },
        modelValue:{
            type: Array,
            required: true
        },
        itemLimit: {
            type: Number,
            default(){
                return 0
            }
        }
    },
    emits:['update:modelValue'],
    data() {
        return {
            keyEnter: false,
            focusInput: false,
            indexSelected: null,
            sadFaces: [':(', ':/',':|',':\\',':c',':[',':ꓷ',
                '<i class="ri-emotion-normal-line ri-lg"></i>',
                '<i class="ri-emotion-unhappy-line ri-lg"></i>',
                '<i class="ri-emotion-sad-line ri-lg"></i>',
            ],
            Math,
        }
    },
    computed: {
        indexName() {
            return Object.getOwnPropertyNames(this.indexObject)[0]
        },
        typesenseInstantsearchAdapter() {
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
                additionalSearchParameters:{
                    limit_hits:10,
                    per_page:10
                },
                collectionSpecificSearchParameters: this.indexObject
            })
        }
    },
    methods: {
        addItem(item){
            this.$refs.input.value = ''
            this.$refs.input.focus()
            const temp = this.modelValue
            if(temp.length == this.itemLimit){
                temp.shift()
            }
            temp.push(item)
            this.$emit('update:modelValue', temp)

        },
        deleteItem(item){
            const temp = this.modelValue
            temp.pop(item)
            this.$emit('update:modelValue', temp)

        }
    },
}
</script>

<style lang="scss">
.search-input-global > .popper{
    @apply w-full;
}
</style>
