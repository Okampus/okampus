<template>
    <div class="flex flex-col">
        <div
            class="box-container app-scrollbar-on-hover overflow-scroll"
            :class="{ 'rounded-b-none': sortedItems.length === 0 }"
        >
            <table ref="table" class="h-full w-full table-auto">
                <thead class="sticky top-0 z-20 w-full">
                    <tr>
                        <th
                            v-for="(col, i) in columns"
                            :key="i"
                            class="bg-4 text-0 whitespace-nowrap font-semibold"
                            :class="{ 'first-cell-sticky header': firstColumnFixed }"
                        >
                            <div
                                class="flex items-center justify-center gap-2 px-6 py-2"
                                :class="[col.class, { 'cursor-pointer': col.sortable }]"
                                @click="col.sortable ? sortAction(i) : () => {}"
                            >
                                {{ col.title }}
                                <i
                                    v-if="col.sortable"
                                    class="text-2 fa"
                                    :class="{
                                        'fa-sort': col.sortable && sortBy !== i,
                                        'fa-sort-up': sortBy === i && sortDirection === 'ASC',
                                        'fa-sort-down': sortBy === i && sortDirection === 'DESC',
                                    }"
                                />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody v-if="sortedItems.length !== 0">
                    <tr v-for="(item, i) in sortedItems" :key="i">
                        <td
                            v-for="(col, j) in columns"
                            :key="j"
                            class="text-1"
                            :class="[{ 'first-cell-sticky': firstColumnFixed }, i % 2 ? 'bg-0' : 'bg-2']"
                        >
                            <div class="px-6 py-2">
                                <slot v-if="$slots[col.id]" :name="col.id" :data="item" :row="i"></slot>
                                <div v-else>{{ item[col.id] }}</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="sortedItems.length === 0" class="bg-2 flex grow flex-col items-center justify-center">
            <img :src="Sleeping" class="h-40 w-40" />
            <div class="text-0 text-2xl font-bold">Aucun élément à afficher</div>
        </div>
    </div>
</template>

<script setup>
    import Sleeping from '@/assets/img/3dicons/sleeping.png'

    import { computed, ref } from 'vue'

    const props = defineProps({
        deadAreaColor: {
            type: String,
            default: '#CCC',
        },
        items: {
            type: Array,
            required: true,
        },
        columns: {
            type: Array,
            required: true,
        },
        firstColumnFixed: {
            type: Boolean,
            default: true,
        },
    })

    const sortDirection = ref('ASC')
    const sortBy = ref(0)

    const sortAction = (name) => {
        sortDirection.value = sortDirection.value === 'DESC' || sortBy.value !== name ? 'ASC' : 'DESC'
        sortBy.value = name
    }

    const sortedItems = computed(() => {
        if (typeof props.columns[sortBy.value].compareFn === 'function') {
            return sortDirection.value === 'ASC'
                ? [...props.items].sort(props.columns[sortBy.value].compareFn)
                : [...props.items].sort(props.columns[sortBy.value].compareFn).reverse()
        }

        return sortDirection.value === 'ASC' ? [...props.items].sort() : [...props.items].sort().reverse()
    })
</script>

<style lang="scss">
    .first-cell-sticky {
        @apply first:z-10 first:left-0 first:sticky first:bg-3-light first:dark:bg-3-dark;

        &:first-child {
            box-shadow: 2px 0 5px -5px rgb(115 115 115 / 75%);
        }

        &.header {
            @apply first:bg-5-light first:dark:bg-5-dark;
        }
    }
</style>
