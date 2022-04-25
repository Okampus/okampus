<template>
    <!-- TODO: Component pour afficher chaque hits + Utiliser SearchInput -->
    <div>
        <AppModal ref="input" :show="showSearchbar" @close="showSearchbar = false">
            <div class="w-full h-full card">
                <ais-instant-search :search-client="searchClient" :index-name="THREADS" class="h-full">
                    <div class="flex flex-col h-full">
                        <ais-search-box autofocus>
                            <template #default="{ currentRefinement, isSearchStalled, refine }">
                                <div
                                    class="flex justify-between items-center w-full cursor-pointer"
                                    @click.prevent="showSearchbar = true"
                                >
                                    <label class="flex grow items-center">
                                        <input
                                            class="grow p-2 border-b-2 md:text-lg lg:text-xl text-4 bg-1"
                                            placeholder="Rechercher une ressource sur Horizon Efrei..."
                                            type="search"
                                            autofocus
                                            :value="currentRefinement"
                                            @input="refine($event.currentTarget.value)"
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="w-6 h-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </label>
                                </div>
                                <span :hidden="!isSearchStalled">Chargement...</span>
                            </template>
                        </ais-search-box>

                        <div class="overflow-y-scroll h-full">
                            <ais-index v-for="(index, i) in indexList" :key="i" :index-name="index.indexName">
                                <ais-hits>
                                    <template #default="{ items }">
                                        <SearchCategory
                                            :items="items"
                                            :index-type="indexList[i]"
                                            @close-modal="showSearchbar = false"
                                        />
                                    </template>
                                </ais-hits>
                            </ais-index>
                        </div>
                    </div>
                </ais-instant-search>
            </div>
        </AppModal>

        <div class="hidden justify-center md:flex">
            <div
                class="flex justify-center items-center p-2 w-full max-w-2xl text-white bg-[#3a5257] dark:bg-[#334041] rounded-md outline-none cursor-text select-none"
                @click="showSearchbar = true"
            >
                <i class="mr-2 fas fa-search" />
                <span>Rechercher sur Horizon Web</span>
            </div>
        </div>
        <!-- <InputWithIcon
            class="hidden md:flex lg:text-lg"
            input-placeholder="Rechercher une ressource sur Horizon Efrei..."
            @click.prevent="showSearchbar = true"
        >
            <i class="ml-0.5 fas fa-search" />
        </InputWithIcon> -->

        <i
            class="block float-right text-2xl text-white cursor-pointer md:hidden fas fa-search"
            @click="showSearchbar = true"
        />
        {{ $refs.modal }}
    </div>
</template>

<script setup>
    import AppModal from '@/components/App/AppModal.vue'
    import SearchCategory from '@/components/App/Card/SearchCategory.vue'
    // import InputWithIcon from '@/components/Input/InputWithIcon.vue'

    import threadTypes from '@/shared/types/thread-types.enum'
    import $typesense from '@/shared/config/typesense.config'
    import {
        BLOGS,
        CLUBS,
        INFO_DOCS,
        STUDY_DOCS,
        SUBJECTS,
        THREADS,
    } from '@/shared/types/typesense-index-names.enum'

    import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

    import { ref } from 'vue'

    const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
        ...$typesense,
        collectionSpecificSearchParameters: {
            [THREADS]: {
                queryBy: 'title,body,tags',
                queryByWeights: '10, 1, 5',
            },
            [BLOGS]: {
                queryBy: 'title,body,tags',
                queryByWeights: '10, 1, 5',
            },
            [CLUBS]: {
                queryBy: 'name',
                queryByWeights: '10',
            },
            [STUDY_DOCS]: {
                queryBy: 'name,subjectEnglishName,subjectName',
                queryByWeights: '10, 5, 5',
            },
            [INFO_DOCS]: {
                queryBy: 'name',
                queryByWeights: '10',
            },
            [SUBJECTS]: {
                queryBy: 'name,code',
                queryByWeights: '1,1',
            },
        },
    })

    const searchClient = typesenseInstantsearchAdapter.searchClient

    const showSearchbar = ref(false)
    const indexList = ref([
        {
            indexName: THREADS,
            title: 'Tous les threads',
            titleIcon: 'comments',
            routerBase: 'post',
            resultTitle: (item) => item.title,
            resultBody: (item) => item.body,
            resultIcon: (item) => threadTypes?.[item.type]?.icon ?? 'hashtag',
        },
        {
            indexName: STUDY_DOCS,
            title: 'Tous les documents',
            titleIcon: 'file',
            routerBase: 'file',
            resultTitle: (item) => item.name,
            resultBody: (item) => item.subjectName,
            resultIcon: () => 'file',
        },
        {
            indexName: INFO_DOCS,
            title: 'Tous les documents informatifs',
            titleIcon: 'file',
            routerBase: 'file',
            resultTitle: (item) => item.name,
            resultBody: (item) => item.subjectName,
            resultIcon: () => 'file',
        },
        {
            indexName: BLOGS,
            title: 'Tous les articles',
            titleIcon: 'newspaper',
            routerBase: 'article',
            resultTitle: (item) => item.title,
            resultBody: (item) => item.body,
            resultIcon: () => 'newspaper',
        },
        {
            indexName: CLUBS,
            title: 'Toutes les associations',
            titleIcon: 'user-friends',
            routerBase: 'club',
            resultTitle: (item) => item.name,
            resultBody: (item) => item.category,
            resultIcon: () => 'user-friends',
        },
        {
            indexName: SUBJECTS,
            title: 'Toutes les matieres',
            titleIcon: 'book',
            routerBase: 'subject',
            resultTitle: (item) => item.name,
            resultBody: (item) => item.code,
            resultIcon: () => 'book',
        },
    ])
</script>
