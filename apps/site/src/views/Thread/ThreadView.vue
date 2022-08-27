<template>
    <div>
        <ThreadFormReport :show="!!report.content" :content="report.content" @close="report.content = null" />
        <ThreadCompact />
    </div>
</template>

<script setup>
    import ThreadFormReport from '@/components/Thread/ThreadFormReport.vue'
    import ThreadCompact from '@/views/Thread/ThreadCompact.vue'

    import { emitter } from '@/shared/modules/emitter'
    import { reactive } from 'vue'

    const report = reactive({ content: null })

    emitter.on('report', (content) => {
        report.content = content
    })
</script>
