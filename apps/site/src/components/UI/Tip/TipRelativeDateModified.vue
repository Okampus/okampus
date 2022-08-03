<template>
    <span class="inline-flex items-center gap-1">
        <TipRelativeDate :action="action" :date="createdAt" />
        <span
            v-if="modifiedAt && modifiedAt != createdAt"
            v-tooltip="`Modifié le ${modifiedAtDateString}`"
            class="text-3 cursor-default select-none text-xs"
            >(modifié)</span
        >
    </span>
</template>

<script setup>
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'
    import { formatDateLong } from '@/utils/dateUtils.js'

    const props = defineProps({
        action: {
            type: String,
            default: '',
        },
        createdAt: {
            type: [String, Date],
            required: true,
        },
        modifiedAt: {
            type: [String, Date],
            default: null,
        },
    })

    const modifiedAtDateString = formatDateLong(props.modifiedAt)
</script>
