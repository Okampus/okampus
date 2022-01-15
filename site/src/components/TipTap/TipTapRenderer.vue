<template>
    <editor-content :editor="editor" />
</template>
<script>
import { Editor, EditorContent, generateHTML } from '@tiptap/vue-3'
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
    watch: {
        'content': 'refreshContent'
    },
    mounted() {
        // console.log("CONTENT", this.content)
        let content
        if ( this.mode === 'json' ) {
            try {
                content = JSON.parse(this.content)
            } catch {
                content = {
                    type: 'doc',
                    content: [
                        this.content ?
                            {
                                type: 'paragraph',
                                content: [
                                    {
                                        type: 'text',
                                        text: this.content
                                    }
                                ]
                            } : {
                                type: 'paragraph'
                            }
                    ]
                }
            }
        } else {
            try {
                content = generateHTML(this.content)
            } catch {
                content = `<p>${this.content}</p>`
            }
        }

        // console.log(content)

        this.editor = new Editor({
            editable: false,
            content,
            extensions: [
                StarterKit,
            ],
        })
    },
    beforeUnmount() {
        this.editor.destroy()
    },
    methods: {
        refreshContent() {
            this.editor.commands.setContent(this.mode === 'json' ? JSON.parse(this.content) : generateHTML(this.content))
        }
    }
}
</script>
