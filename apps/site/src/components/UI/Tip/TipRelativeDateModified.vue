<template>
    <span class="inline-flex gap-1">
        <TipRelativeDate :date="createdAt" />
        <span v-if="modifiedAt != createdAt" class="flex gap-1">
            <Popper :hover="true" placement="top" :arrow="true" offset-distance="3">
                <span class="text-xs cursor-default select-none text-3">(modifié)</span>
                <template #content>
                    <div class="card-tip">Modifié <TipRelativeDate :date="modifiedAt" /></div>
                </template>
            </Popper>
        </span>
    </span>
</template>

<script setup>
    import Popper from 'vue3-popper'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    defineProps({
        createdAt: {
            type: [String, Date],
            required: true,
        },
        modifiedAt: {
            type: [String, Date],
            default: null,
        },
    })
</script>
