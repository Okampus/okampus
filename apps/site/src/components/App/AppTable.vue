<template>
    <table
        class="border-separate border-spacing-2"
        :class="[tableLayout === 'auto' ? 'table-auto' : 'table-fixed']"
    >
        <thead>
            <tr>
                <th
                    v-for="(header, i) in headers"
                    :key="i"
                    :class="[header.class, { 'sticky left-0': i === 0 && firstColumnFixed }]"
                >
                    <div class="flex cursor-pointer items-center gap-2" @click="sortAction(header.name)">
                        <div>{{ header.text }}</div>
                        <i
                            v-if="header.sortable"
                            class="text-2 fas"
                            :class="{
                                'fa-sort': header.sortable && sortBy !== header.name,
                                'fa-sort-up': sortBy === header.name && sortDirection === 'asc',
                                'fa-sort-down': sortBy === header.name && sortDirection === 'desc',
                            }"
                        />
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, i) in sortedItem" :key="i">
                <td
                    v-for="(header, k) in headers"
                    :key="k"
                    :class="{ 'sticky left-0': k === 0 && firstColumnFixed }"
                    class="h-1 snap-start"
                >
                    <slot v-if="slots[header.name]" :name="header.name" :="item"></slot>
                    <div v-else class="p-2">{{ item[header.name] }}</div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
    import { ref, computed, useSlots } from 'vue'

    const props = defineProps({
        items: { type: Array, default: () => [] },
        headers: { type: Array, required: true },
        firstColumnFixed: { type: Boolean, default: false },
        modelValue: { type: Array, default: null },
        tableLayout: { type: String, default: 'auto' },
    })

    defineEmits(['update:modelValue'])

    const sortBy = ref(props.headers[0].name)
    const sortDirection = ref('asc')

    const sortAction = (name) => {
        sortDirection.value = sortDirection.value === 'desc' || sortBy.value !== name ? 'asc' : 'desc'
        sortBy.value = name
    }

    const sortedItem = computed(() => {
        const items = props.items.slice()
        items.sort((a, b) => {
            const aVal = a[sortBy.value]
            const bVal = b[sortBy.value]
            if (aVal > bVal) {
                return 1
            } else if (aVal < bVal) {
                return -1
            }
            return 0
        })
        return sortDirection.value === 'asc' ? items : items.reverse()
    })

    const slots = useSlots()
</script>
