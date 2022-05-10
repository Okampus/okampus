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
                                        <i class="ml-0.5 fas fa-search" />
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
                class="flex justify-center items-center p-2 w-full max-w-2xl text-white bg-slate-700 dark:bg-slate-800 rounded-md outline-none cursor-text select-none"
                @click="showSearchbar = true"
            >
                <i class="mr-2 fas fa-search" />
                <span>Rechercher sur Horizon Web</span>
            </div>
        </div>

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

    import threadTypes from '@/shared/types/thread-types.enum'
    import typesenseConfig from '@/shared/config/typesense.config'

    import {
        BLOGS,
        TEAMS,
        INFO_DOCS,
        STUDY_DOCS,
        SUBJECTS,
        THREADS,
    } from '@/shared/types/typesense-index-names.enum'

    import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

    import { ref } from 'vue'

    const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
        ...typesenseConfig,
        collectionSpecificSearchParameters: {
            [THREADS]: {
                queryBy: 'title,body,tags',
                queryByWeights: '10, 1, 5',
            },
            [BLOGS]: {
                queryBy: 'title,body,tags',
                queryByWeights: '10, 1, 5',
            },
            [TEAMS]: {
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
            indexName: TEAMS,
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
