<template>
    <TipTapEditor
        v-if="edit"
        v-model="body"
        :sendable="sendable"
        :cancellable="cancellable"
        :editor-buttons="editorButtons"
        :editor-classes="editorClasses"
        :char-count="charCount"
        @cancel="$emit('update:edit', false), (body = content), $emit('cancel')"
        @send="$emit('update:edit', false), $emit('update:content', body), $emit('send', body)"
    />
    <TipTapRenderer v-else :content="body" class="p-2" />
</template>

<script>
    import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'
    import TipTapRenderer from '@/components/TipTap/TipTapRenderer.vue'
    import { defaultEditorButtons, defaultTipTapText } from '@/utils/tiptap'
    import { watch } from 'vue'

    export default {
        components: {
            TipTapRenderer,
            TipTapEditor,
        },
        props: {
            content: {
                type: String,
                default: defaultTipTapText,
            },
            cancellable: {
                type: Boolean,
                default: true,
            },
            sendable: {
                type: Boolean,
                default: true,
            },
            editorButtons: {
                type: Array,
                default: defaultEditorButtons,
            },
            editorClasses: {
                type: Array,
                default: () => ['min-h-20'],
            },
            charCount: {
                type: [Number, Object],
                default: 0,
            },
            edit: {
                type: Boolean,
                default: false,
            },
            emitContent: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['cancel', 'send', 'update:content', 'update:edit'],
        data() {
            return { body: this.content ?? defaultTipTapText }
        },
        mounted() {
            if (this.emitContent) {
                watch(
                    () => this.body,
                    (newContent) => {
                        this.$emit('update:content', newContent)
                    },
                )
                watch(
                    () => this.content,
                    (newContent) => {
                        if (newContent != this.body) {
                            this.body = newContent
                        }
                    },
                )
            } else {
                watch(
                    () => this.content,
                    (newContent) => {
                        this.body = newContent
                    },
                )
            }
        },
    }
</script>
