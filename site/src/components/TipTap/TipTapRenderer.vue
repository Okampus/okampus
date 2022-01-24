<template>
    <EditorContent :editor="editor" />
</template>
<script>
import { getEditor } from '@/utils/tiptap'
import {
    EditorContent, generateHTML,
} from '@tiptap/vue-3'

export default {
    components: { EditorContent },
    props: {
        content: {
            type: String,
            default: '',
        },
        mode: {
            type: String,
            default: 'json',
        },
        editorOptions: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props, ctx) {
        return {
            editor: getEditor({
                ctx,
                updateEvent: 'update:modelValue',
                editorOptions: {
                    editable: false,
                    ...props.editorOptions,
                },
                content: props.content,
                mode: props.mode,
            }),
        }
    },
    watch: { 'content': 'refreshContent' },
    methods: {
        refreshContent() {
            this.editor.commands.setContent(
                this.mode === 'json' ? JSON.parse(this.content) : generateHTML(this.content),
            )
        },
    },
}
</script>
