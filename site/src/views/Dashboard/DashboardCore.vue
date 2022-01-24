<template>
    <div class="flex p-3 my-3 w-full bg-gray-50 dark:bg-gray-800 rounded-lg">
        <SelectMultiCheckbox
            v-model="selectedCols"
            :filters="getCols()"
            button-name="Voir les colonnes..."
            input-placeholder="Filtrer les colonnes..."
        />
    </div>
    <table class="overflow-x-scroll w-full rounded-table">
        <thead>
            <tr
                class="text-xs font-semibold tracking-wide text-left text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700"
            >
                <th
                    v-for="(col, colName) in columns"
                    :key="colName"
                    class="py-3 px-4"
                    :class="{ hidden: !(selectedCols.includes(colName) || selectedCols.includes(col.name)) }"
                >
                    {{ col.name || colcamelToSentenceCase(colName) }}
                </th>
            </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
            <tr
                v-for="(item, i) in itemsSorted"
                :key="i"
                class="text-gray-700 dark:text-gray-400 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900"
            >
                <td
                    v-for="(col, colName) in columns"
                    :key="colName"
                    class="py-3 px-4"
                    :class="{ hidden: !(selectedCols.includes(colName) || selectedCols.includes(col.name)) }"
                >
                    <component :is="col.comp[0]" :="col.attrs(item)">
                        {{ col.slot(item) }}
                    </component>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="js">
import { defineAsyncComponent } from 'vue'
import SelectMultiCheckbox from '@/components/Input/SelectMultiCheckbox.vue'
import {
    TransitionRoot,
    Dialog,
} from '@headlessui/vue'
import ThreadCompactView from '@/views/Thread/ThreadCompactView.vue'
import { camelToSentenceCase } from '@/utils/caseUtils'

export default {
    components: {
        SelectMultiCheckbox,
        TransitionRoot,
        Dialog,
        ThreadCompactView,
    },
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        startSelectedCols: {
            type: Array,
            default: () => undefined,
        },
        columns: {
            type: Object,
            default: () => {},
        },
    },
    data () {
        return {
            selectedCols: this.startSelectedCols === undefined ? this.getCols() : [...this.startSelectedCols],
            sortColumn: '',
            columnsSort: Object.fromEntries(
                Object.values(this.columns).map(colName => [colName, 0]),
            ),
        }
    },
    computed: {
        itemsSorted() {
            return [...this.items].sort((a, b) => {
                if (this.sortColumn !== '') {
                    a = this.columns[this.sortColumn].value(a)
                    b = this.columns[this.sortColumn].value(b)
                    if (a > b) {
                        return this.columnsSort[this.sortColumn] ? 1 : -1
                    } else if (a < b) {
                        return this.columnsSort[this.sortColumn] ? -1 : 1
                    }
                }
                return 0
            })
        },
    },
    beforeCreate () {
        for (const column in this.columns) {
            if (this.columns[column].comp.length > 1) {
                const comp = this.columns[column].comp[1].replace('@/', '').replace('.vue', '')
                const splitComp = comp.split('/')
                if (splitComp.length === 1) {
                    this.$options.components[this.columns[column].comp[0]] = defineAsyncComponent(() => import(`../../${splitComp[0]}.vue`))
                }
                if (splitComp.length === 2) {
                    this.$options.components[this.columns[column].comp[0]] = defineAsyncComponent(() => import(`../../${splitComp[0]}/${splitComp[1]}.vue`))
                }
                if (splitComp.length === 3) {
                    this.$options.components[this.columns[column].comp[0]] = defineAsyncComponent(() => import(`../../${splitComp[0]}/${splitComp[1]}/${splitComp[2]}.vue`))
                }
                if (splitComp.length === 4) {
                    this.$options.components[this.columns[column].comp[0]] = defineAsyncComponent(() => import(`../../${splitComp[0]}/${splitComp[1]}/${splitComp[2]}/${splitComp[3]}.vue`)).default;
                }
            }
        }
    },
    methods: {
        getCols() {
            return Object.keys(this.columns).map(x => this.columns[x].name || camelToSentenceCase(x))
        },
        camelToSentenceCase,
        sortTable: function sortTable (colName) {
            if (colName !== this.sortColumn) {
                this.columnsSort[this.sortColumn] = 0
                this.sortColumn = colName
            }
            this.columnsSort[this.sortColumn] = this.columnsSort[this.sortColumn] === -1 ? 0 : (this.columnsSort[this.sortColumn] === 1 ? -1 : 1)
        },
    },
}
</script>

<style>
.rounded-table {
    border-collapse: collapse;
    border-radius: 15px;
    overflow: hidden;
}
</style>
