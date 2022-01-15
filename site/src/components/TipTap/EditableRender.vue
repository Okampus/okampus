<template>
    <div>
        <TipTapEditor
            v-if="show"
            v-model="body"
            :sendable="true"
            :cancellable="true"
            :editor-classes="editorClasses"
            @cancel="$emit('update:show', false) ; body = content ; $emit('cancel')"
            @send="$emit('update:show', false) ; $emit('update:content', body) ; $emit('validate', body)"
        />
        <TipTapRenderer
            v-else
            :content="body"
        />
    </div>
</template>

<script lang="js">
import TipTapRenderer from '@/components/TipTap/TipTapRenderer.vue'
import { watch } from 'vue'
import TipTapEditor from './TipTapEditor.vue'

export default {
    components: {
        TipTapRenderer,
        TipTapEditor
    },
    props: {
        content: {
            type: String,
            default: () => '{"type":"doc","content":[{"type":"paragraph"}]}'
        },
        editorClasses: {
            type: Array,
            default: () => ['min-h-20']
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    emits: ['cancel', 'validate', 'update:content', 'update:show'],
    data() {
        // console.log("CONTENT", this.content)
        return {
            // body: '{"type":"doc","content":[{"type":"paragraph"}]}',
            body: this.content ?? '{"type":"doc","content":[{"type":"paragraph"}]}',
        }
    },
    mounted() {
        watch(
            () => this.content,
            (newContent) => {
                this.body = newContent
            }
        )
    }
    // watch() {
    //     (oldContent, newContent) => {
    //         this.body = newContent
    //     }
    // }

}
</script>
