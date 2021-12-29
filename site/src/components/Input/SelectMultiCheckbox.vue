<template>
    <v-popper
        placement="bottom-start"
        offset-distance="0"
    >
        <button class="raised select">
            <div>
                {{ buttonName }}
            </div>
        </button>

        <template #content>
            <div
                class="z-10 mt-2 max-w-md max-h-md overflow-hidden card-0 p-4"
            >
                <div class="mb-2">
                    <bottom-border-input
                        v-model="search"
                        :input-placeholder="inputPlaceholder"
                    >
                        <i class="ri-search-line" />
                    </bottom-border-input>
                </div>
                <div class="flex flex-col space-y-1 overflow-scroll">
                    <div class="px-1 rounded flex items-center space-x-1.5">
                        <input
                            :id="`${uuid}`"
                            v-model="allSelected"
                            type="checkbox"
                        >
                        <label
                            :for="`${uuid}`"
                            class="cursor-pointer font-semibold text-lg w-full"
                        >
                            {{ allSelected ? 'Tout décocher' : 'Tout cocher' }}
                        </label>
                    </div>
                    <template
                        v-for="(filter, i) in filteredList"
                        :key="i"
                    >
                        <div
                            class="flex items-center space-x-2 px-1 rounded"
                            :class="{'bg-blue-200 dark:bg-blue-800': checkedFilters.includes(filter)}"
                        >
                            <input
                                :id="`${uuid}_${i}`"
                                v-model="checkedFilters"
                                type="checkbox"
                                :value="filter"
                            >
                            <label
                                :for="`${uuid}_${i}`"
                                class="cursor-pointer w-full"
                            >
                                {{ filter }}
                            </label>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </v-popper>
</template>

<script>
import { nanoid } from 'nanoid'
import BottomBorderInput from '@/components/Input/BottomBorderInput.vue'

export default {
    components: { BottomBorderInput },
    props: {
        buttonName: {
            type: String,
            default: 'Choix'
        },
        inputPlaceholder: {
            type: String,
            default: 'Rechercher...'
        },
        filters: {
            type: Array,
            default: () => []
        },
        modelValue: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:modelValue'],
    data () {
        return {
            uuid: nanoid(6),
            search: '',
        }
    },
    computed: {
        filteredList () {
            return this.filters.filter((item) => {
                return item.toLowerCase().includes(this.search.toLowerCase())
            })
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
            }
        },
        checkedFilters: {
            get () {
                return this.modelValue
            },
            set (value) {
                this.allSelected = this.modelValue.length === this.filters.length
                this.$emit('update:modelValue', value)
            }
        }
    },
}
</script>
