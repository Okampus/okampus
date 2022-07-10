<template>
    <div>
        <teleport to="#app" :disabled="windowWidth > 767">
            <ais-instant-search
                :index-name="TEAMS"
                :search-client="searchClient"
                :class="[
                    showSearchbar && windowWidth <= 767
                        ? 'w-screen top-0 left-0 z-[60] absolute h-topbar topbar flex items-center justify-center'
                        : 'hidden',
                ]"
                class="grow gap-2 justify-center mx-auto md:flex"
            >
                <div
                    ref="searchBar"
                    class="flex relative gap-4 justify-center items-center p-2 w-full max-w-2xl h-11 text-white bg-slate-700 dark:bg-slate-800 rounded-t-md outline-none cursor-text select-none"
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

                    <ais-search-box
                        class="grow h-full"
                        :class="{ 'opacity-0': !showSearchbar && !searchInput.length }"
                    >
                        <template #default="{ refine }">
                            <input
                                ref="input"
                                type="text"
                                class="absolute top-0 left-10 w-[90%] h-full bg-inherit outline-none"
                                placeholder="Rechercher sur Okampus..."
                                :value="searchInput"
                                @input="
                                    refine($event.currentTarget.value),
                                        (searchInput = $event.currentTarget.value)
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
                    class="absolute top-11 z-40 w-full max-w-2xl md:top-full"
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
                                <i class="p-3 bg-green-400 rounded-md fa-solid fa-people-group"></i>
                                <ais-highlight
                                    attribute="name"
                                    :hit="item"
                                    :class-names="{
                                        'ais-Highlight-highlighted': 'font-bold underline',
                                    }"
                                    highlighted-tag-name="span"
                                />
                                <ais-highlight
                                    attribute="shortDescription"
                                    class="text-xs text-gray-400"
                                    :hit="item"
                                    :class-names="{
                                        'ais-Highlight-highlighted': 'font-bold underline',
                                    }"
                                    highlighted-tag-name="span"
                                />
                            </div>
                        </div>
                    </template>
                </ais-hits>
                <div
                    v-else
                    class="flex absolute top-11 z-40 flex-col gap-2 p-2 w-full max-w-2xl text-white bg-slate-700 dark:bg-slate-800 rounded-b-md md:top-full"
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
        </teleport>
        <i
            class="block float-right text-2xl text-white cursor-pointer md:hidden fas fa-search"
            @click="showSearchbar = true"
        />
    </div>
</template>

<script setup>
    import { TEAMS } from '@/shared/types/typesense-index-names.enum'
    import typesenseConfig from '@/shared/config/typesense.config'
    import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
    import { ref } from 'vue'
    import { onClickOutside } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    import { useLocalStorage } from '@vueuse/core'
    import _ from 'lodash'

    const typesenseAdapter = new TypesenseInstantSearchAdapter({
        ...typesenseConfig,
        additionalSearchParameters: {
            limit_hits: 5,
            per_page: 5,
            query_by: 'name, shortDescription',
            query_by_weights: 'name:2, shortDescription:1',
        },
    })

    const searchClient = typesenseAdapter.searchClient
    const input = ref(null)
    const showSearchbar = ref(false)
    const searchInput = ref('')
    const searchBar = ref(null)
    const router = useRouter()
    const recentSearch = useLocalStorage('recentSearch', [])

    const windowWidth = ref(window.innerWidth)
    window.onresize = () => {
        windowWidth.value = window.innerWidth
    }

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
</script>
