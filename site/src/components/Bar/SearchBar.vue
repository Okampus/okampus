<template>
    <!-- TODO: Local Storage pour voir les recherches recentes + Comonent pour afficher chaque hits -->
    <div>
        <CustomModal
            ref="input"
            :show="showSearchBar"
            :modal-custom-class="'w-3/4 h-3/4'"
            @close="showSearchBar = false"
        >
            <div class="card w-full h-full">
                <ais-instant-search
                    :search-client="searchClient"
                    index-name="posts"
                    class="h-full"
                >
                    <div class="h-full flex flex-col">
                        <ais-search-box autofocus>
                            <template #default="{ currentRefinement, isSearchStalled, refine }">
                                <div
                                    class="w-full flex justify-between items-center cursor-pointer"
                                    @click.prevent="showSearchBar = true"
                                >
                                    <label class="flex-grow flex items-center">
                                        <input
                                            class="border-b-2 flex-grow text-4 md:text-lg lg:text-xl bg-1 p-2"
                                            placeholder="Rechercher une ressource sur Horizon Efrei..."
                                            type="search"
                                            autofocus
                                            :value="currentRefinement"
                                            @input="refine($event.currentTarget.value)"
                                        >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-6 w-6"
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

                        <div

                            class="overflow-y-scroll h-full"
                        >
                            <ais-index
                                v-for="(index, i) in indexList"
                                :key="i"
                                :index-name="index.indexName"
                            >
                                <ais-hits>
                                    <template #default="{ items }">
                                        <SearchCategory
                                            :items="items"
                                            :index-type="indexList[i]"
                                            @close-modal="showSearchBar=false"
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
            class="w-full flex justify-between items-center cursor-pointer"
            @click.prevent="showSearchBar = true"
        >
            <div class="border-b-2 flex-grow text-4 md:text-lg lg:text-xl">
                Rechercher une ressource sur Horizon Efrei...
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
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
import SearchCategory from "@/components/App/Card/SearchCategory.vue"
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import postTypesEnum from '@/shared/types/post-types.enum';

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
    additionalSearchParameters:{
        limit_hits:25,
        per_page:25
    },
    collectionSpecificSearchParameters: {
        posts: {
            queryBy: "title,body,tags",
            queryByWeights:"10, 1, 5"
        },
        'study-docs': {
            queryBy: "name,subjectEnglishName,subjectName",
            queryByWeights:"10, 5, 5"
        },
        clubs:{
            queryBy:"name",
            queryByWeights:"10"
        },
        'info-docs':{
            queryBy: "name",
            queryByWeights:"10"
        },
        articles:{
            queryBy: "title,body,tags,category",
            queryByWeights:"10, 1, 5, 5"
        }
        ,
        subjects:{
            queryBy:'name,code',
            queryByWeights:'1,1'
        }

    },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;
export default {
    components:{
        CustomModal,
        SearchCategory
    },

    data() {
        return {
            searchClient,
            showSearchBar : false,
            indexList:[
                {
                    indexName: "posts",
                    title: "Tous les posts",
                    titleIcon: "comments",
                    routerBase: "post",
                    resultTitle: (item)=>{ return item.title },
                    resultBody: (item)=>{ return item.body },
                    resultIcon: (item)=>{ return postTypesEnum?.[item.type]?.icon ?? 'hashtag' }
                },
                {
                    indexName: "study-docs",
                    title: "Tous les documents",
                    titleIcon: "file",
                    routerBase: "file",
                    resultTitle: (item) => { return item.name },
                    resultBody: (item) => { return item.subjectName },
                    resultIcon: () => { return 'file' }
                },
                {
                    indexName: "info-docs",
                    title: "Tous les documents informatifs",
                    titleIcon: "file",
                    routerBase: "file",
                    resultTitle: (item) => { return item.name },
                    resultBody: (item) => { return item.subjectName },
                    resultIcon: () => { return 'file'}
                },
                {
                    indexName: "articles",
                    title: "Tous les articles",
                    titleIcon: "newspaper",
                    routerBase: "article",
                    resultTitle: (item) => { return item.title },
                    resultBody: (item) => { return item.body },
                    resultIcon: () => { return 'newspaper' }
                },
                {
                    indexName: "clubs",
                    title: "Toutes les associations",
                    titleIcon: "user-friends",
                    routerBase: "club",
                    resultTitle: (item) => { return item.name },
                    resultBody: (item) => { return item.category },
                    resultIcon: () => { return 'user-friends'}
                },
                {
                    indexName: "subjects",
                    title: "Toutes les matieres",
                    titleIcon: "book",
                    routerBase: "subject",
                    resultTitle: (item) => { return item.name },
                    resultBody: (item) => { return item.code },
                    resultIcon: () => { return 'book'}
                },
            ]
        }
    },
}
</script>
