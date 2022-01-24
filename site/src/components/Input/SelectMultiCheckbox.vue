<template>
    <Popper placement="bottom-start" offset-distance="0">
        <button class="raised select">
            <div>
                {{ buttonName }}
            </div>
        </button>

        <template #content>
            <div class="overflow-hidden z-10 p-4 mt-2 max-w-md max-h-md card-0">
                <div class="mb-2">
                    <BottomBorderInput v-model="search" :input-placeholder="inputPlaceholder">
                        <font-awesome-icon icon="search" />
                    </BottomBorderInput>
                </div>
                <div class="flex overflow-scroll flex-col space-y-1">
                    <div class="flex items-center px-1 space-x-1.5 rounded">
                        <input :id="`${uuid}`" v-model="allSelected" type="checkbox" />
                        <label :for="`${uuid}`" class="w-full text-lg font-semibold cursor-pointer">
                            {{ allSelected ? 'Tout décocher' : 'Tout cocher' }}
                        </label>
                    </div>
                    <template v-for="(filter, i) in filteredList" :key="i">
                        <div
                            class="flex items-center px-1 space-x-2 rounded"
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
import BottomBorderInput from '@/components/Input/BottomBorderInput.vue'
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
