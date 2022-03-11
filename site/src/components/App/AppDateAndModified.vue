<template>
    <span class="inline-flex gap-1">
        <DatePreview :date="createdAt" />
        <span v-if="modifiedAt != createdAt" class="flex gap-1">
            <Popper :hover="true" placement="top" :arrow="true" offset-distance="3">
                <span class="text-xs cursor-default select-none text-3">(modifié)</span>
                <template #content>
                    <div class="card-tip">Modifié <DatePreview :date="modifiedAt" /></div>
                </template>
            </Popper>
        </span>
    </span>
</template>

<script setup>
    import Popper from 'vue3-popper'
    import DatePreview from '@/components/App/Preview/DatePreview.vue'
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
