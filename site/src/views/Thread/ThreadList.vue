<template>
    <!-- TODO: add filtering, tab, info panel -->

    <div v-if="threads.length" class="flex flex-col gap-4 my-2 mx-4">
        <ThreadPreviewCard v-for="(thread, i) in threads" :key="i" :thread="thread" />
    </div>
    <div v-else class="ml-32 text-2xl text-0">Aucun post ne correspond à ces critères.</div>
</template>

<script setup>
    import ThreadPreviewCard from '@/components/App/Card/ThreadPreviewCard.vue'

    defineProps({
        threads: {
            type: Array,
            required: true,
        },
    })
</script>
