<template>
    <span class="inline-flex gap-1">
        <TipRelativeDate :date="createdAt" />
        <span v-if="modifiedAt && modifiedAt != createdAt" class="flex gap-1">
            <Popper :hover="true" placement="top" :arrow="true" offset-distance="3">
                <span class="text-3 cursor-default select-none text-xs">(modifié)</span>
                <template #content>
                    <div class="rounded-md bg-gray-900/90 p-2.5 text-base text-gray-100 dark:bg-black/90">
                        {{ modifiedAtDateString }}
                    </div>
                </template>
            </Popper>
        </span>
    </span>
</template>

<script setup>
    import Popper from 'vue3-popper'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

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

    const modifiedAtDateString = new Intl.DateTimeFormat('fr', {
        dateStyle: 'full',
        timeStyle: 'long',
    }).format(new Date(props.modifiedAt))
</script>
