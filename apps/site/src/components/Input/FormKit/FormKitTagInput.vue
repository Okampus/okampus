<template>
    <TagInput :placeholder="placeholder" :model-value="context._value" @update:model-value="handleInput" />
</template>

<script setup>
    import { computed } from 'vue'
    import TagInput from '@/components/Input/TagInput.vue'

    const props = defineProps({
        context: {
            type: Object,
            required: true,
        },
    })

    const placeholder = computed(() => props.context.placeholder)

    const handleInput = (value) => {
        props.context.node.input(value)
    }

    handleInput([])
</script>
