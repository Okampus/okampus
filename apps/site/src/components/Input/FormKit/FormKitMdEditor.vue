<template>
    <MdEditor
        :uid="uid"
        :char-count="charCount"
        :min-char-count="minCharCount"
        :placeholder="placeholder"
        :model-value="context._value"
        @update:model-value="handleInput"
    />
</template>

<script setup>
    import { computed } from 'vue'
    import MdEditor from '@/components/Input/Editor/MdEditor.vue'

    const props = defineProps({
        context: {
            type: Object,
            required: true,
        },
    })

    const uid = computed(() => props.context.uid)
    const charCount = computed(() => props.context.charCount)
    const minCharCount = computed(() => props.context.minCharCount)
    const placeholder = computed(() => props.context.placeholder)

    const handleInput = (value) => {
        props.context.node.input(value)
    }

    const defaultValue = computed(() => props.context.defaultValue)

    if (defaultValue.value) {
        handleInput(defaultValue.value)
    }
</script>
