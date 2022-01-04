<template>
    <editor-content :editor="editor" />
</template>
<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default {
    components: {
        EditorContent,
    },
    props: {
        content: {
            type: String,
            default: ''
        },
        mode: {
            type: String,
            default: 'json'
        },
    },
    data() {
        return {
            editor: null,
        }
    },
    mounted() {
        this.editor = new Editor({
            editable: false,
            content: JSON.parse(this.content),
            extensions: [
                StarterKit,
            ],
        })
    },
    beforeUnmount() {
        this.editor.destroy()
    }
}
</script>
