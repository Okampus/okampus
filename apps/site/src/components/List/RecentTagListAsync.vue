<template>
    <div class="flex flex-wrap gap-4">
        <LabelTag
            v-for="(tag, i) in threads.tags"
            :key="i"
            class="inline"
            :class="small ? 'text-xs' : 'text-sm'"
            :tag-name="tag.name"
        />
    </div>
</template>

<script setup>
    import LabelTag from '@/components/UI/Label/LabelTag.vue'
    import { useThreadsStore } from '@/store/threads.store'

    const threads = useThreadsStore()
    await threads.getTags({ itemsPerPage: 100 })
</script>
