<template>
    <Suspense>
        <template #default>
            <div>
                <FormReport
                    :show="!!report.content"
                    :content="report.content"
                    @close="report.content = null"
                />
                <ThreadCompact />
            </div>
        </template>
        <template #fallback>
            <AppLoader :size="3" />
        </template>
    </Suspense>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import FormReport from '@/components/Form/FormReport.vue'
    import ThreadCompact from './ThreadCompact.vue'

    import { emitter } from '@/shared/modules/emitter'
    import { reactive } from 'vue'

    const report = reactive({ content: null })

    emitter.on('report', (content) => {
        report.content = content
    })
</script>
