<template>
    <div>
        <TipTapEditor
            v-if="show"
            v-model="body"
            :sendable="true"
            :cancellable="true"
            :editor-buttons="editorButtons"
            :editor-classes="editorClasses"
            @cancel="$emit('update:show', false), (body = content), $emit('cancel')"
            @send="$emit('update:show', false), $emit('update:content', body), $emit('validate', body)"
        />
        <TipTapRenderer v-else :content="body" />
    </div>
</template>

<script lang="js">
import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'
import TipTapRenderer from '@/components/TipTap/TipTapRenderer.vue'
import {
    defaultEditorButtons, defaultTipTapText,
} from '@/utils/tiptap'
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
        editorButtons: {
            type: Array,
            default: defaultEditorButtons,
        },
        editorClasses: {
            type: Array,
            default: () => ['min-h-20'],
        },
        show: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['cancel', 'validate', 'update:content', 'update:show'],
    data() {
        return { body: this.content ?? defaultTipTapText }
    },
    mounted() {
        watch(
            () => this.content,
            (newContent) => {
                this.body = newContent
            },
        )
    },
}
</script>
