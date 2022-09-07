<template>
    <ais-instant-search
        v-if="searchClient"
        ref="searchbar"
        :index-name="tenant"
        :search-client="searchClient"
        class="mx-auto grow items-center justify-center gap-2 md:flex"
    >
        <div class="flex w-full justify-center">
            <div
                class="relative flex w-full cursor-pointer flex-col items-center md:max-w-4xl md:cursor-text md:bg-[#374058] md:shadow-xl"
                :class="showSearchbar ? 'bg-[#374058]' : 'md:bg-[#374058]'"
                @click="() => ((showSearchbar = true), searchInput.focus())"
            >
                <div
                    class="fa fa-search absolute -top-5 right-0 flex h-10 items-center justify-center text-xl text-gray-200 md:hidden"
                />
                <div
                    class="absolute inset-x-0 -top-5 flex flex-col bg-inherit md:rounded-[1.2rem]"
                    :class="
                        showSearchbar
                            ? 'md-max:top-0 md-max:left-0 md-max:fixed md-max:w-screen md-max:h-screen md:max-h-[51.5vh] md-max:text-xl'
                            : 'md-max:hidden h-10'
                    "
                >
                    <ais-search-box @keydown.stop="closeOnKeydown">
                        <template #default="{ refine }">
                            <div
                                class="flex h-10 w-full items-center gap-2 py-2 px-3 pl-6"
                                :class="{ 'md-max:mt-1 md-max:py-0 md-max:h-16': showSearchbar }"
                            >
                                <button
                                    v-if="showSearchbar"
                                    class="fa fa-arrow-left cursor-pointer py-3 pl-2 text-2xl md:hidden"
                                    @click.stop="() => (showSearchbar = false)"
                                />
                                <input
                                    ref="searchInput"
                                    v-model="searchText"
                                    placeholder="Rechercher sur Okampus 🚀"
                                    type="text"
                                    class="grow bg-inherit outline-none"
                                    :class="{ 'md-max:ml-4': showSearchbar }"
                                    @input="refine($event.currentTarget.value)"
                                    @keypress.enter="
                                        router.push('/search/', { searchInput }), (showSearchbar = false)
                                    "
                                />
                                <div class="flex h-10 shrink-0 items-center gap-2">
                                    <button
                                        v-if="searchText"
                                        class="fa fa-xmark flex w-8 justify-center text-2xl text-gray-400"
                                        @click.stop="() => (searchText = '')"
                                    />
                                    <button
                                        class="fa fa-search flex w-8 justify-center text-xl text-gray-200"
                                        :class="showSearchbar ? 'md-max:hidden' : ''"
                                        @click.stop="
                                            router.push('/search/', { searchInput }), (showSearchbar = false)
                                        "
                                    />
                                </div>
                            </div>
                        </template>
                    </ais-search-box>
                    <ais-hits
                        :class="{ hidden: !searchText.length || !showSearchbar }"
                        class="mb-4 overflow-hidden"
                    >
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
                                <template v-if="item.metaType === 'user' || item.metaType === 'team'">
                                    <ProfileAvatar
                                        :rounded-full="false"
                                        :clickable="false"
                                        :avatar="item.picture"
                                        :name="item.title"
                                    />
                                    <div class="flex flex-col">
                                        <ais-highlight
                                            attribute="title"
                                            :hit="item"
                                            :class-names="{
                                                'ais-Highlight-highlighted': 'font-bold underline',
                                            }"
                                            highlighted-tag-name="span"
                                        />
                                        <ais-highlight
                                            attribute="description"
                                            class="text-xs text-gray-300 line-clamp-1"
                                            :hit="item"
                                            :class-names="{
                                                'ais-Highlight-highlighted': 'font-bold underline',
                                            }"
                                            highlighted-tag-name="span"
                                        />
                                    </div>
                                </template>
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
                            class="group search-item flex w-full items-center justify-between"
                            @click.stop="resultClick(item)"
                            @keypress.enter="resultClick(item)"
                        >
                            <div class="flex items-center gap-3">
                                <i
                                    class="fa-solid fa-clock-rotate-left flex h-12 w-12 items-center justify-center rounded-md bg-gray-500 text-xl"
                                />
                                <div>{{ item.title }}</div>
                            </div>
                            <button
                                class="fa-solid fa-xmark mr-4 justify-self-end text-xl text-gray-200 md-max:text-3xl"
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
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

    import { ref } from 'vue'

    import { onClickOutside } from '@vueuse/core'

    import { useRouter } from 'vue-router'
    import { useLocalStorage } from '@vueuse/core'
    import { useCookies } from 'vue3-cookies'

    import { unionBy, remove } from 'lodash'

    import { getTenant } from '@/utils/getTenant'
    import { emitter } from '@/shared/modules/emitter'
    import { CLUB } from '@/shared/types/team-types.enum'

    const itemToLink = (entity) => {
        if (entity.metaType === 'team' && entity.category === CLUB) {
            return `/club/${entity.realId}`
        }
        if (entity.metaType === 'user') {
            return `/user/${entity.realId}`
        }
        return ''
    }

    const tenant = getTenant()

    const { cookies } = useCookies()
    const parseApiKeyCookie = (cookie) => {
        try {
            return cookie.split(':')[1].split('.')[0]
        } catch {
            return null
        }
    }

    const searchClient = ref(null)
    const setSearchClient = (key) => {
        const apiKey = key && parseApiKeyCookie(cookies.get('meiliSearchKey'))
        searchClient.value = apiKey ? instantMeiliSearch(import.meta.env.VITE_MEILISEARCH_HOST, apiKey) : null
    }

    setSearchClient(cookies.get('meiliSearchKey'))

    emitter.on('logout', () => setSearchClient(null))
    emitter.on('login', () => setSearchClient(cookies.get('meiliSearchKey')))

    const showSearchbar = ref(false)
    const searchbar = ref(null)
    onClickOutside(searchbar, () => (showSearchbar.value = false))

    const router = useRouter()

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

        recentSearch.value = unionBy(recentSearch.value, [item], (el) => el.id).slice(-5)
        const link = itemToLink(item)
        console.log(link)
        if (link && router.currentRoute.path !== link) {
            router.push(link)
        }
    }

    const deleteSearch = (item) => {
        recentSearch.value = remove(recentSearch.value, (el) => el.id !== item.id)
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
