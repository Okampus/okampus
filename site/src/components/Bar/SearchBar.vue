<template>
    <!-- TODO: Local Storage pour voir les recherches recentes + Comonent pour afficher chaque hits -->
    <div>
        <CustomModal
            ref="input"
            :show="showSearchBar"
            :modal-custom-class="'w-3/4 h-3/4'"
            @close="showSearchBar = false"
        >
            <div class="w-full h-full card">
                <ais-instant-search :search-client="searchClient" index-name="posts" class="h-full">
                    <div class="flex flex-col h-full">
                        <ais-search-box autofocus>
                            <template #default="{ currentRefinement, isSearchStalled, refine }">
                                <div
                                    class="flex justify-between items-center w-full cursor-pointer"
                                    @click.prevent="showSearchBar = true"
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
                                            @close-modal="showSearchBar = false"
                                        />
                                    </template>
                                </ais-hits>
                            </ais-index>
                        </div>
                    </div>
                </ais-instant-search>
            </div>
        </CustomModal>
        <div
            class="flex justify-between items-center w-full cursor-pointer"
            @click.prevent="showSearchBar = true"
        >
            <div class="grow border-b-2 md:text-lg lg:text-xl text-4">
                Rechercher une ressource sur Horizon Efrei...
            </div>
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
        </div>
        {{ $refs.modal }}
    </div>
</template>

<script>
    import CustomModal from '@/components/App/AppModal.vue'
    import SearchCategory from '@/components/App/Card/SearchCategory.vue'
    import postTypesEnum from '@/shared/types/post-types.enum'
    import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

    const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
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
            limit_hits: 25,
            per_page: 25,
        },
        collectionSpecificSearchParameters: {
            posts: {
                queryBy: 'title,body,tags',
                queryByWeights: '10, 1, 5',
            },
            'study-docs': {
                queryBy: 'name,subjectEnglishName,subjectName',
                queryByWeights: '10, 5, 5',
            },
            clubs: {
                queryBy: 'name',
                queryByWeights: '10',
            },
            'info-docs': {
                queryBy: 'name',
                queryByWeights: '10',
            },
            articles: {
                queryBy: 'title,body,tags,category',
                queryByWeights: '10, 1, 5, 5',
            },
            subjects: {
                queryBy: 'name,code',
                queryByWeights: '1,1',
            },
        },
    })
    const searchClient = typesenseInstantsearchAdapter.searchClient
    export default {
        components: {
            CustomModal,
            SearchCategory,
        },

        data() {
            return {
                searchClient,
                showSearchBar: false,
                indexList: [
                    {
                        indexName: 'posts',
                        title: 'Tous les posts',
                        titleIcon: 'comments',
                        routerBase: 'post',
                        resultTitle: (item) => item.title,
                        resultBody: (item) => item.body,
                        resultIcon: (item) => postTypesEnum?.[item.type]?.icon ?? 'hashtag',
                    },
                    {
                        indexName: 'study-docs',
                        title: 'Tous les documents',
                        titleIcon: 'file',
                        routerBase: 'file',
                        resultTitle: (item) => item.name,
                        resultBody: (item) => item.subjectName,
                        resultIcon: () => 'file',
                    },
                    {
                        indexName: 'info-docs',
                        title: 'Tous les documents informatifs',
                        titleIcon: 'file',
                        routerBase: 'file',
                        resultTitle: (item) => item.name,
                        resultBody: (item) => item.subjectName,
                        resultIcon: () => 'file',
                    },
                    {
                        indexName: 'articles',
                        title: 'Tous les articles',
                        titleIcon: 'newspaper',
                        routerBase: 'article',
                        resultTitle: (item) => item.title,
                        resultBody: (item) => item.body,
                        resultIcon: () => 'newspaper',
                    },
                    {
                        indexName: 'clubs',
                        title: 'Toutes les associations',
                        titleIcon: 'user-friends',
                        routerBase: 'club',
                        resultTitle: (item) => item.name,
                        resultBody: (item) => item.category,
                        resultIcon: () => 'user-friends',
                    },
                    {
                        indexName: 'subjects',
                        title: 'Toutes les matieres',
                        titleIcon: 'book',
                        routerBase: 'subject',
                        resultTitle: (item) => item.name,
                        resultBody: (item) => item.code,
                        resultIcon: () => 'book',
                    },
                ],
            }
        },
    }
</script>
