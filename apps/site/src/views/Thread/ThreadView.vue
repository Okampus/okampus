<template>
    <Suspense>
        <template #default>
            <div>
                <ThreadFormReport
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
    import ThreadFormReport from '@/components/Thread/ThreadFormReport.vue'
    import ThreadCompact from './ThreadCompact.vue'

    import { emitter } from '@/shared/modules/emitter'
    import { reactive } from 'vue'

    const report = reactive({ content: null })

    emitter.on('report', (content) => {
        report.content = content
    })
</script>

<style lang="scss">
    .content-show-focused {
        transition: opacity 0.5s ease;

        .content-parent:hover & {
            opacity: 1;
        }
    }

    .content-parent a {
        @apply text-blue-400 hover:text-blue-600 hover:underline;
    }

    .content-parent p + p {
        @apply mt-3;
    }
</style>
