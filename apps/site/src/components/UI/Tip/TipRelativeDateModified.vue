<template>
    <span class="inline-flex gap-1">
        <TipRelativeDate :date="createdAt" />
        <span v-if="modifiedAt && modifiedAt != createdAt" class="flex gap-1">
            <TipPopper :tip="`Modifié le ${modifiedAtDateString}`">
                <span class="text-3 cursor-default select-none text-xs">(modifié)</span>
            </TipPopper>
        </span>
    </span>
</template>

<script setup>
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'
    import { formatDateLong } from '@/utils/dateUtils.js'

    const props = defineProps({
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
