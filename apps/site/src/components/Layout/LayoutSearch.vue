<template>
    <ais-instant-search
        :index-name="TEAMS"
        :search-client="searchClient"
        class="grow gap-2 justify-center items-center mx-auto md:flex"
    >
        <div class="flex justify-center w-full">
            <div
                v-if="showSearchbar"
                class="fixed top-0 left-0 z-[10] w-screen h-screen"
                @click="showSearchbar = false"
            />
            <div
                class="flex relative flex-col items-center w-full bg-[#374058] cursor-text md:max-w-4xl md:shadow-xl"
                @click="() => ((showSearchbar = true), searchInput.focus())"
            >
                <div
                    class="flex absolute inset-x-0 -top-5 flex-col bg-inherit md:rounded-[1.2rem]"
                    :class="
                        showSearchbar
                            ? 'md-max:top-0 md-max:left-0 md-max:fixed md-max:w-screen md-max:h-screen md:max-h-[50vh] z-[20] md-max:text-xl'
                            : 'h-10 rounded-[1.2rem]'
                    "
                >
                    <ais-search-box @keydown.stop="closeOnKeydown">
                        <template #default="{ refine }">
                            <div
                                class="flex gap-2 items-center py-2 px-3 pl-6 w-full h-10"
                                :class="{ 'md-max:mt-1 md-max:py-0 md-max:h-16': showSearchbar }"
                            >
                                <button
                                    v-if="showSearchbar"
                                    class="py-3 pl-2 text-2xl cursor-pointer md:hidden fa fa-arrow-left"
                                    @click.stop="() => (showSearchbar = false)"
                                />
                                <input
                                    ref="searchInput"
                                    v-model="searchText"
                                    type="text"
                                    class="grow bg-inherit outline-none"
                                    :class="{ 'md-max:ml-4': showSearchbar }"
                                    @input="refine($event.currentTarget.value)"
                                    @keypress.enter="
                                        router.push('/search/', { searchInput }), (showSearchbar = false)
                                    "
                                />
                                <div class="flex shrink-0 gap-2 items-center h-10">
                                    <button
                                        v-if="searchText"
                                        class="flex justify-center w-8 text-2xl text-gray-400 fa fa-xmark"
                                        @click.stop="() => (searchText = '')"
                                    />
                                    <button
                                        class="flex justify-center w-8 text-xl text-indigo-400 fa fa-search"
                                        :class="showSearchbar ? 'md-max:hidden' : ''"
                                        @click.stop="
                                            router.push('/search/', { searchInput }), (showSearchbar = false)
                                        "
                                    />
                                </div>
                            </div>
                        </template>
                    </ais-search-box>
                    <ais-hits :class="{ hidden: !searchText.length || !showSearchbar }" class="mb-4">
                        <template #default="{ items }">
                            <hr v-if="items.length" class="search-separator" />
                            <div
                                v-for="(item, i) in items"
                                :key="i"
                                tabindex="0"
                                class="search-item"
                                @click.stop="resultClick(item)"
                                @keypress.enter="resultClick(item)"
                            >
                                <i class="p-3 bg-green-400 rounded-md fa-solid fa-people-group"></i>
                                <div class="flex flex-col">
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
                                        class="text-xs text-gray-300"
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
                        v-if="recentSearch.length"
                        :class="{ hidden: searchText.length || !showSearchbar }"
                        class="mb-4"
                    >
                        <hr class="search-separator" />
                        <div
                            v-for="item in recentSearch"
                            :key="item.text_match"
                            tabindex="0"
                            class="group flex justify-between items-center w-full search-item"
                            @click.stop="resultClick(item)"
                            @keypress.enter="resultClick(item)"
                        >
                            <div class="flex gap-3 items-center">
                                <i class="p-3 bg-gray-500 rounded-md fa-solid fa-clock-rotate-left" />
                                <div>{{ item.name }}</div>
                            </div>
                            <button
                                class="justify-self-end mr-4 text-3xl text-gray-400 fa-solid fa-xmark"
                                @click.stop="deleteSearch(item)"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ais-instant-search>
</template>

<script setup>
    import { TEAMS } from '@/shared/types/typesense-index-names.enum'
    import typesenseConfig from '@/shared/config/typesense.config'
    import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
    import { ref } from 'vue'

    import { useRouter } from 'vue-router'
    import { useLocalStorage } from '@vueuse/core'
    import _ from 'lodash'

    const router = useRouter()

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

    const showSearchbar = ref(false)

    const closeOnKeydown = (e) => {
        if (e.key === 'Escape') {
            showSearchbar.value = false
        }
    }

    const searchInput = ref(null)
    const searchText = ref('')

    const recentSearch = useLocalStorage('recentSearch', [])

    const resultClick = (item) => {
        showSearchbar.value = false
        searchText.value = ''

        recentSearch.value = _.unionBy(recentSearch.value, [item], (el) => el.id).slice(-5)
        router.push(`/club/${item.id}`)
    }

    const deleteSearch = (item) => {
        recentSearch.value = _.remove(recentSearch.value, (el) => el.id !== item.id)
    }
</script>

<style lang="scss">
    .search-separator {
        @apply mx-4 border-gray-400 mb-2;
    }

    .search-item {
        @apply flex gap-3 items-center px-3 cursor-pointer hover:bg-[#5a6279] py-2;
    }
</style>
