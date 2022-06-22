<template>
    <!-- TODO: Component pour afficher chaque hits + Utiliser SearchInput -->
    <div>
        <!-- <ModalPopup ref="input" :show="showSearchbar" @close="showSearchbar = false">
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
                                            placeholder="Rechercher une ressource sur Okampus..."
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
        </ModalPopup> -->
        <ais-instant-search
            :index-name="TEAMS"
            :search-client="searchClient"
            class="hidden gap-2 justify-center md:flex"
        >
            <div
                ref="searchBar"
                class="flex relative gap-4 justify-center items-center p-2 w-full max-w-2xl text-white bg-slate-700 dark:bg-slate-800 rounded-t-md outline-none cursor-text select-none"
                :class="{ 'rounded-b-md': !showSearchbar }"
                @click="input.focus(), (showSearchbar = true)"
            >
                <div class="grow ml-2 h-full">
                    <i
                        class="w-full transition-all duration-300 fas fa-search"
                        :class="{ 'translate-x-[95%]': !showSearchbar && searchInput.length === 0 }"
                    />
                </div>
                <div :class="{ 'hidden': showSearchbar || searchInput.length !== 0 }">
                    <span> Rechercher sur Okampus... </span>
                </div>

                <ais-search-box class="grow" :class="{ 'opacity-0': !showSearchbar && !searchInput.length }">
                    <template #default="{ refine }">
                        <input
                            ref="input"
                            type="text"
                            class="absolute top-0 left-10 w-[90%] h-full bg-inherit outline-none"
                            placeholder="Rechercher sur Okampus..."
                            :value="searchInput"
                            @input="
                                refine($event.currentTarget.value), (searchInput = $event.currentTarget.value)
                            "
                            @keypress.enter="router.push('/search/', { searchInput })"
                        />
                    </template>
                </ais-search-box>
                <i
                    :class="{ 'opacity-0': !showSearchbar && searchInput.length === 0 }"
                    class="p-1 text-slate-400 rounded border border-slate-400 rotate-90 fa-solid fa-arrow-turn-down"
                ></i>
            </div>
            <ais-hits
                v-if="!recentSearch.length || searchInput.length"
                class="absolute top-full z-40 w-full max-w-2xl"
            >
                <template #default="{ items }">
                    <div
                        class="flex flex-col gap-2 p-2 text-white bg-slate-700 dark:bg-slate-800 rounded-b-md"
                        :class="{ 'absolute hidden': !showSearchbar || !items.length }"
                    >
                        <div
                            v-for="(item, i) in items"
                            :key="i"
                            class="flex gap-4 items-center p-2 hover:bg-slate-800 focus:bg-slate-800 dark:hover:bg-slate-900 dark:focus:bg-slate-900 rounded-md outline-none cursor-pointer"
                            tabindex="0"
                            @click="resultClick(item)"
                            @keypress.enter="resultClick(item)"
                        >
                            <i class="p-3 bg-green-300 rounded-md fa-solid fa-people-group"></i>
                            <div>{{ item.name }}</div>
                        </div>
                    </div>
                </template>
            </ais-hits>
            <div
                v-else
                class="flex absolute top-full z-40 flex-col gap-2 p-2 w-full max-w-2xl text-white bg-slate-700 dark:bg-slate-800 rounded-b-md"
                :class="{ 'absolute hidden': !showSearchbar || !recentSearch }"
            >
                <div
                    v-for="item in recentSearch"
                    :key="item.text_match"
                    class="flex justify-between items-center py-2 px-3 hover:bg-slate-800 focus:bg-slate-800 dark:hover:bg-slate-900 dark:focus:bg-slate-900 rounded-md outline-none cursor-pointer"
                    tabindex="0"
                    @click.self="resultClick(item)"
                    @keypress.enter="resultClick(item)"
                >
                    <div class="flex gap-4 items-center">
                        <i
                            class="p-3 bg-gray-400 dark:bg-gray-500 rounded-md fa-solid fa-clock-rotate-left"
                        ></i>
                        <div>{{ item.name }}</div>
                    </div>
                    <i
                        class="text-gray-400 hover:text-gray-300 dark:text-gray-500 dark:hover:text-gray-400 fa-solid fa-xmark"
                        @click.prevent="deleteSearch(item)"
                    ></i>
                </div>
            </div>
        </ais-instant-search>
        <i
            class="block float-right text-2xl text-white cursor-pointer md:hidden fas fa-search"
            @click="showSearchbar = true"
        />
    </div>
</template>

<script setup>
    // import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    // import SearchCategory from '@/components/App/Card/SearchCategory.vue'
    // import threadTypes from '@/shared/types/thread-types.enum'
    import typesenseConfig from '@/shared/config/typesense.config'
    import {
        // BLOGS,
        TEAMS,
        // INFO_DOCS,
        // STUDY_DOCS,
        // SUBJECTS,
        THREADS,
        USERS,
    } from '@/shared/types/typesense-index-names.enum'
    import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
    import { ref } from 'vue'
    import { onClickOutside } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    import { useLocalStorage } from '@vueuse/core'
    import _ from 'lodash'

    const typesenseAdapter = new TypesenseInstantSearchAdapter({
        ...typesenseConfig,
        collectionSpecificSearchParameters: {
            [THREADS]: {
                queryBy: 'title,body,tags,author',
                queryByWeights: '10, 1, 5, 5',
            },
            // [BLOGS]: {
            //     queryBy: 'title,body,tags',
            //     queryByWeights: '10, 1, 5',
            // },
            [USERS]: {
                queryBy: 'name,email,bio',
                queryByWeights: '10, 1, 5',
            },
            [TEAMS]: {
                queryBy: 'name',
                queryByWeights: '10',
            },
            // [STUDY_DOCS]: {
            //     queryBy: 'name,subjectEnglishName,subjectName',
            //     queryByWeights: '10, 5, 5',
            // },
            // [INFO_DOCS]: {
            //     queryBy: 'name',
            //     queryByWeights: '10',
            // },
            // [SUBJECTS]: {
            //     queryBy: 'name,code',
            //     queryByWeights: '1,1',
            // },
        },
    })

    const searchClient = typesenseAdapter.searchClient
    const input = ref(null)
    const showSearchbar = ref(false)
    const searchInput = ref('')
    const searchBar = ref(null)
    const router = useRouter()
    const recentSearch = useLocalStorage('recentSearch', [])
    console.warn(recentSearch)

    onClickOutside(searchBar, () => {
        showSearchbar.value = false
    })

    const resultClick = (item) => {
        showSearchbar.value = false
        searchInput.value = ''
        recentSearch.value = _.unionBy(recentSearch.value, [item], (el) => el.id).slice(-5)
        router.push(`/club/${item.id}`)
    }

    const deleteSearch = (item) => {
        recentSearch.value = _.remove(recentSearch.value, (el) => el.id !== item.id)
    }

    // const indexList = ref([
    //     {
    //         indexName: THREADS,
    //         title: 'Tous les threads',
    //         titleIcon: 'comments',
    //         routerBase: 'threads',
    //         resultTitle: (item) => item.title,
    //         resultBody: (item) => item.body,
    //         resultIcon: (item) => threadTypes?.[item.type]?.icon ?? 'hashtag',
    //     },
    // {
    //     indexName: STUDY_DOCS,
    //     title: 'Tous les documents',
    //     titleIcon: 'file',
    //     routerBase: 'files',
    //     resultTitle: (item) => item.name,
    //     resultBody: (item) => item.subjectName,
    //     resultIcon: () => 'file',
    // },
    // {
    //     indexName: INFO_DOCS,
    //     title: 'Tous les documents informatifs',
    //     titleIcon: 'file',
    //     routerBase: 'files',
    //     resultTitle: (item) => item.name,
    //     resultBody: (item) => item.subjectName,
    //     resultIcon: () => 'file',
    // },
    // {
    //     indexName: BLOGS,
    //     title: 'Tous les articles',
    //     titleIcon: 'newspaper',
    //     routerBase: 'article',
    //     resultTitle: (item) => item.title,
    //     resultBody: (item) => item.body,
    //     resultIcon: () => 'newspaper',
    // },
    // {
    //     indexName: TEAMS,
    //     title: 'Toutes les associations',
    //     titleIcon: 'user-friends',
    //     routerBase: 'clubs',
    //     resultTitle: (item) => item.name,
    //     resultBody: (item) => item.category,
    //     resultIcon: () => 'user-friends',
    // },
    // {
    //     indexName: SUBJECTS,
    //     title: 'Toutes les matieres',
    //     titleIcon: 'book',
    //     routerBase: 'subject',
    //     resultTitle: (item) => item.name,
    //     resultBody: (item) => item.code,
    //     resultIcon: () => 'book',
    // },
    // ])
</script>
