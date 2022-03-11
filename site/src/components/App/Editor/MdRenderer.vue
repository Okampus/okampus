<template>
    <div ref="renderer" />
</template>
<script setup>
    import VditorPreview from 'vditor/dist/method.min'
    import { onMounted, ref, watch } from 'vue'

    const renderer = ref(null)

    const props = defineProps({
        content: {
            type: String,
            default: '',
        },
    })

    const renderConfig = {
        markdown: {
            toc: true,
            listStyle: true,
        },
        speech: {
            enable: false,
        },
        lang: 'en_US',
        anchor: 1,
        lazyLoadImage: 'https://cdn.jsdelivr.net/npm/vditor/dist/images/img-loading.svg',
    }

    onMounted(() => {
        VditorPreview.preview(renderer.value, props.content, renderConfig)
    })

    watch(
        () => props.content,
        (content) => {
            VditorPreview.preview(renderer.value, content, renderConfig)
        },
    )
</script>
