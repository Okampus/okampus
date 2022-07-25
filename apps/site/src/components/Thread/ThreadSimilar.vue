<template>
    <div class="p-1/2 flex w-auto flex-col pb-1 pl-1">
        <hr class="mb-2" />
        <div class="w-5/6">
            <div class="text-base font-bold">
                {{ thread.title }}
            </div>
            <div class="flex flex-wrap">
                <LabelTag v-for="tag in thread.tags" :key="tag" :name="tag.title" :tag-color="tag.color" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import LabelTag from '@/components/UI/Label/LabelTag.vue'

    defineProps({
        thread: {
            type: Object,
            default: () => {},
        },
    })
</script>
