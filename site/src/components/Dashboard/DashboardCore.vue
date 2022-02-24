<template>
    <!-- TODO: Refactor -->
    <div class="flex flex-col gap-3">
        <div class="flex">
            <SelectMultiCheckbox
                v-model="selectedCols"
                :filters="Object.keys(columns).map((x) => columns[x].name || camelToSentenceCase(x))"
                button-name="Voir les colonnes..."
                input-placeholder="Filtrer les colonnes..."
            />
        </div>
        <table class="overflow-x-scroll w-full rounded-table">
            <thead>
                <tr class="text-xs font-semibold tracking-wide text-left uppercase text-3 bg-3">
                    <th
                        v-for="(col, colName) in columns"
                        :key="colName"
                        class="py-3 px-4"
                        :class="{
                            hidden: !(selectedCols.includes(colName) || selectedCols.includes(col.name)),
                        }"
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
                        :class="{
                            hidden: !(selectedCols.includes(colName) || selectedCols.includes(col.name)),
                        }"
                    >
                        <component :is="componentLoader(col.comp)" v-bind="col.attrs(item)">
                            {{ col.slot(item) }}
                        </component>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    import { computed, defineAsyncComponent, ref } from 'vue'
    import SelectMultiCheckbox from '@/components/Input/SelectMultiCheckbox.vue'

    import { camelToSentenceCase } from '@/utils/caseUtils'

    const getComponentAsync = (path) => {
        const comp = path.replace('@/', '').replace('.vue', '')
        const splitComp = comp.split('/')
        if (splitComp.length === 1) {
            return defineAsyncComponent(() => import(`../../${splitComp[0]}.vue`))
        }
        if (splitComp.length === 2) {
            return defineAsyncComponent(() => import(`../../${splitComp[0]}/${splitComp[1]}.vue`))
        }
        if (splitComp.length === 3) {
            return defineAsyncComponent(() =>
                import(`../../${splitComp[0]}/${splitComp[1]}/${splitComp[2]}.vue`),
            )
        }
        if (splitComp.length === 4) {
            return defineAsyncComponent(() =>
                import(`../../${splitComp[0]}/${splitComp[1]}/${splitComp[2]}/${splitComp[3]}.vue`),
            )
        }
    }

    const componentLoader = (comp) => {
        if (comp.length == 2) {
            return getComponentAsync(comp[1])
        } else {
            return comp[0]
        }
    }

    const props = defineProps({
        columns: {
            type: Object,
            required: true,
        },
        items: {
            type: Array,
            default: () => [],
        },
        initSelectedCols: {
            type: Array,
            default: null,
        },
    })

    const selectedCols = ref(
        props.initSelectedCols ??
            Object.keys(props.columns).map((x) => props.columns[x].name || camelToSentenceCase(x)),
    )
    const sortColumn = ref('')
    const columnsSort = Object.fromEntries(Object.values(props.columns).map((colName) => [colName, 0]))

    const itemsSorted = computed(() =>
        [...props.items].sort((a, b) => {
            if (sortColumn.value === '') {
                return 0
            }
            a = props.columns[props.sortColumn].value(a)
            b = props.columns[props.sortColumn].value(b)
            return a > b ? columnsSort[props.sortColumn] : a < b ? -columnsSort[props.sortColumn] : 0
        }),
    )

    // const sortTable = (colName) => {
    //     if (colName !== props.sortColumn) {
    //         props.columnsSort[props.sortColumn] = 0
    //         props.sortColumn = colName
    //     }
    //     props.columnsSort[props.sortColumn] =
    //         props.columnsSort[props.sortColumn] === -1 ? 0 : props.columnsSort[props.sortColumn] === 1 ? -1 : 1
    // }
</script>

<style>
    .rounded-table {
        overflow: hidden;
        border-collapse: collapse;
        border-radius: 15px;
    }
</style>
