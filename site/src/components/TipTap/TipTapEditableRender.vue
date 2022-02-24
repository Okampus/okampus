<template>
    <TipTapEditor
        v-if="edit"
        v-model="body"
        :sendable="sendable"
        :cancellable="cancellable"
        :editor-buttons="editorButtons"
        :editor-classes="editorClasses"
        :char-count="charCount"
        @cancel="cancel"
        @send="send"
    />
    <TipTapRenderer v-else :content="body" />
</template>

<script setup>
    import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'
    import TipTapRenderer from '@/components/TipTap/TipTapRenderer.vue'
    import { defaultEditorButtons, defaultTipTapText } from '@/utils/tiptap'
    import { onMounted, ref, watchEffect } from 'vue'

    const props = defineProps({
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
    })

    const emit = defineEmits(['cancel', 'send', 'update:content', 'update:edit'])
    const body = ref(props.content ?? defaultTipTapText)

    const cancel = () => {
        if (props.cancellable) {
            emit('update:edit', false)
            body.value = props.content
            emit('cancel')
        }
    }

    const send = () => {
        if (props.sendable) {
            emit('update:edit', false)
            emit('send', body.value)
        }
    }

    onMounted(() => {
        if (props.emitContent) {
            watchEffect(() => emit('update:content', body.value))
            watchEffect(() => (body.value = props.content != body.value ? props.content : body.value))
        } else {
            watchEffect(() => (body.value = props.content))
        }
    })
</script>
