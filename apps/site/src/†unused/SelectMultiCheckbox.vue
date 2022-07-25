<template>
    <Popper placement="bottom-start" offset-distance="0">
        <button class="raised select">
            <div>
                {{ buttonName }}
            </div>
        </button>

        <template #content>
            <div class="max-h-md card-0 z-10 mt-2 max-w-md overflow-hidden p-4">
                <div class="mb-2">
                    <BottomBorderInput v-model="search" :input-placeholder="inputPlaceholder">
                        <i class="fas fa-search" />
                    </BottomBorderInput>
                </div>
                <div class="flex flex-col space-y-1 overflow-scroll">
                    <div class="flex items-center space-x-1.5 rounded px-1">
                        <input :id="`${uuid}`" v-model="allSelected" type="checkbox" />
                        <label :for="`${uuid}`" class="w-full cursor-pointer text-lg font-semibold">
                            {{ allSelected ? 'Tout décocher' : 'Tout cocher' }}
                        </label>
                    </div>
                    <template v-for="(filter, i) in filteredList" :key="i">
                        <div
                            class="flex items-center space-x-2 rounded px-1"
                            :class="{ 'bg-blue-200 dark:bg-blue-800': checkedFilters.includes(filter) }"
                        >
                            <input
                                :id="`${uuid}_${i}`"
                                v-model="checkedFilters"
                                type="checkbox"
                                :value="filter"
                            />
                            <label :for="`${uuid}_${i}`" class="w-full cursor-pointer">
                                {{ filter }}
                            </label>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </Popper>
</template>

<script>
    import { nanoid } from 'nanoid'
    import BottomBorderInput from '@/components/Dashboard/BottomBorderInput.vue'
    import Popper from 'vue3-popper'

    export default {
        components: {
            BottomBorderInput,
            Popper,
        },
        props: {
            buttonName: {
                type: String,
                default: 'Choix',
            },
            inputPlaceholder: {
                type: String,
                default: 'Rechercher...',
            },
            filters: {
                type: Array,
                default: () => [],
            },
            modelValue: {
                type: Array,
                default: () => [],
            },
        },
        emits: ['update:modelValue'],
        data() {
            return {
                uuid: nanoid(6),
                search: '',
            }
        },
        computed: {
            filteredList() {
                return this.filters.filter((item) => item.toLowerCase().includes(this.search.toLowerCase()))
            },
            allSelected: {
                get() {
                    return this.modelValue.length === this.filters.length
                },
                set(value) {
                    if (value) {
                        this.$emit('update:modelValue', this.filters)
                    } else {
                        this.$emit('update:modelValue', [])
                    }
                },
            },
            checkedFilters: {
                get() {
                    return this.modelValue
                },
                set(value) {
                    this.allSelected = this.modelValue.length === this.filters.length
                    this.$emit('update:modelValue', value)
                },
            },
        },
    }
</script>
