<template>
    <div class="relative">
        <div
            ref="searchContainer"
            class="input flex h-max cursor-text flex-wrap items-center gap-2 overflow-auto pt-2"
            tabindex="0"
            v-bind="focused ? { 'focused': 'true' } : {}"
            @focus="activateResults"
            @click="activateResults"
        >
            <template v-if="showLabels">
                <LabelIndexedEntity
                    v-for="(entity, i) in selectedItems"
                    :key="i"
                    :entity="entity"
                    :closable="true"
                    @close="toggleItem(entity)"
                />
            </template>
            <Dropdown
                handle-resize
                class="grow basis-0"
                theme="no-arrow"
                placement="bottom-start"
                :triggers="[]"
                :shown="showResults"
                :auto-hide="false"
            >
                <input
                    ref="searchInput"
                    v-model="search"
                    type="text"
                    :placeholder="floatingLabel ? '' : placeholder"
                    class="placeholder h-8 w-full min-w-[1em] bg-transparent outline-none"
                    @blur="focused = false"
                    @focus="focused = true"
                    @keydown="keypress"
                />
                <template #popper>
                    <div ref="resultsPopper" class="w-72">
                        <GraphQLQuery
                            :query="typeof searchQuery === 'string' ? (gql) => gql(searchQuery) : searchQuery"
                            :variables="{ search, query: { page: 1, itemsPerPage: 10 } }"
                            :whole-page="false"
                            :update="
                                (data) => {
                                    results = data?.[queryName]
                                    return data?.[queryName]
                                }
                            "
                        >
                            <template #empty>
                                <div class="bg-1 m-2">Aucun résultat.</div>
                            </template>
                            <template #default="{ data: items }">
                                <div class="bg-1">
                                    <button
                                        v-for="(item, i) in items"
                                        :key="i"
                                        class="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-2-light active:bg-blue-200 dark:hover:bg-2-dark dark:active:bg-blue-600"
                                        :class="{ 'bg-blue-200 dark:bg-blue-600': i === resultIndex }"
                                        @click="toggleItem(item)"
                                    >
                                        <div class="flex items-center gap-2">
                                            <ProfileAvatar
                                                v-if="avatarTypes.includes(item.metaType)"
                                                :rounded-full="false"
                                                :avatar="item.picture"
                                                :size="2.5"
                                                :name="item.title"
                                            />
                                            <img
                                                v-else-if="item.picture"
                                                :src="item.picture"
                                                class="h-10 w-10 rounded-xl"
                                            />
                                            <i
                                                v-else
                                                class="fa fa-search flex h-10 w-10 items-center justify-center"
                                            />
                                            <div class="flex flex-col items-start">
                                                <div class="text-base line-clamp-1">{{ item.title }}</div>
                                                <div class="text-3 text-xs line-clamp-1">
                                                    {{ item.category }}
                                                </div>
                                            </div>
                                        </div>
                                        <i
                                            v-if="
                                                selectedItems.some(
                                                    (selected) => selected.realId === item.realId,
                                                )
                                            "
                                            class="fa fa-check pr-2 text-2xl"
                                        />
                                    </button>
                                    <div class="my-1 text-center">
                                        {{ items.length }} résultat{{ items.length > 1 ? 's' : '' }}
                                    </div>
                                </div>
                            </template>
                        </GraphQLQuery>
                    </div>
                </template>
            </Dropdown>
        </div>
        <div
            v-if="floatingLabel"
            :class="{ 'floating py-0': focused || selectedItems.length || search }"
            class="floating-label bg-2 z-0 rounded-t-md p-1"
        >
            {{ placeholder }}
        </div>
    </div>
</template>

<script setup>
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import LabelIndexedEntity from '@/components/UI/Label/LabelIndexedEntity.vue'

    import { Dropdown } from 'floating-vue'

    import { onClickOutside } from '@vueuse/core'
    import { ref } from 'vue'

    const avatarTypes = ['team', 'user']

    const props = defineProps({
        searchQuery: {
            type: Object,
            required: true,
        },
        queryName: {
            type: String,
            required: true,
        },
        floatingLabel: {
            type: Boolean,
            default: true,
        },
        placeholder: {
            type: String,
            default: 'Rechercher...',
        },
        modelValue: {
            type: Array,
            default: () => [],
        },
        showLabels: {
            type: Boolean,
            default: true,
        },
    })

    const emit = defineEmits(['update:modelValue'])

    const searchInput = ref(null)
    const focused = ref(false)

    const resultsPopper = ref(null)

    const search = ref('')
    const showResults = ref(false)

    const selectedItems = ref(props.modelValue)

    const results = ref([])
    const resultIndex = ref(null)

    const activateResults = () => {
        showResults.value = true
        focused.value = true
        searchInput.value.focus()
    }

    const toggleItem = (item) => {
        selectedItems.value = selectedItems.value.some((selected) => selected.realId === item.realId)
            ? selectedItems.value.filter((selected) => selected.realId !== item.realId)
            : [...selectedItems.value, item]

        emit('update:modelValue', selectedItems.value)
        resultIndex.value = null
        search.value = ''

        setTimeout(() => {
            window.dispatchEvent(new Event('resize')) // Required to update the position of the popper manually
            showResults.value = true
            searchInput.value.focus()
        }, 10)
    }

    const decreaseOrMax = (value, max) => (value === null ? max : value - 1 < 0 ? max : value - 1)
    const increaseOrZero = (value, max) => (value === null ? 0 : value + 1 > max ? 0 : value + 1)

    const keypress = (event) => {
        if (event.key === 'ArrowUp') {
            resultIndex.value = decreaseOrMax(resultIndex.value, results.value.length - 1)
        } else if (event.key === 'ArrowDown') {
            resultIndex.value = increaseOrZero(resultIndex.value, results.value.length - 1)
        } else if (event.key === 'Enter') {
            event.stopPropagation()
            event.preventDefault()
            if (resultIndex.value !== null) toggleItem(results.value[resultIndex.value])
        } else if (event.key === 'Backspace') {
            if (search.value.length === 0 && selectedItems.value.length > 0)
                toggleItem(selectedItems.value[selectedItems.value.length - 1])
        } else if (event.key === 'Escape') {
            if (focused.value) {
                event.stopPropagation()
                event.preventDefault()
            }
            showResults.value = false
            focused.value = false
        } else {
            showResults.value = true
            focused.value = true
        }
    }

    onClickOutside(resultsPopper, () => {
        showResults.value = false
        resultIndex.value = null
    })
</script>
