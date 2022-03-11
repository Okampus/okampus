<template>
    <MdEditor
        v-if="edit"
        v-model="editedBody"
        :sendable="sendable"
        :cancellable="cancellable"
        :char-count="charCount"
        :uid="uid"
        @cancel="cancel"
        @send="send"
    />
    <MdRenderer v-else :content="body" />
</template>

<script setup>
    import MdEditor from '@/components/App/Editor/MdEditor.vue'
    import MdRenderer from '@/components/App/Editor/MdRenderer.vue'
    import { onMounted, ref, watchEffect } from 'vue'

    const props = defineProps({
        uid: {
            type: String,
            required: true,
        },
        edit: {
            type: Boolean,
            default: false,
        },
        content: {
            type: String,
            required: true,
        },
        cancellable: {
            type: Boolean,
            default: true,
        },
        sendable: {
            type: Boolean,
            default: true,
        },
        charCount: {
            type: [Number, Object],
            default: 0,
        },
    })

    const emit = defineEmits(['cancel', 'send', 'update:content', 'update:edit'])
    const body = ref(props.content)
    const editedBody = ref(props.content)

    const cancel = () => {
        if (props.cancellable) {
            emit('update:edit', false)
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
