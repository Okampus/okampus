<template>
    <div ref="renderer" class="markdown-body" v-html="output" />
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue'
    import { marked } from 'marked'
    import hljs from 'highlight.js'

    const renderer = ref(null)

    const props = defineProps({
        content: {
            type: String,
            default: '',
        },
    })

    const output = computed(() =>
        marked(props.content, {
            highlight: function (markdown) {
                return hljs.highlightAuto(markdown).value
            },
            breaks: true,
        }),
    )

    onMounted(() => {
        hljs.highlightAll()
    })
</script>

<style>
    @import 'highlight.js/styles/monokai-sublime.css';

    .markdown-body > p > img {
        display: flex;
        max-width: 90%;
        max-height: 600px;
        margin: auto;
    }

    .markdown-body a {
        @apply text-blue-400 hover:text-blue-600 hover:underline;
    }

    .markdown-body p + p {
        @apply mt-3;
    }
</style>
