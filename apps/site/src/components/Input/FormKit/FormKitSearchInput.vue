<template>
    <MultiSearchInput
        :placeholder="placeholder"
        :search-query="searchQuery"
        :query-name="queryName"
        :disabled="disabled"
        :model-value="context._value?.value ?? context._value"
        @update:model-value="handleInput"
    />
</template>

<script setup>
    import MultiSearchInput from '@/components/Input/MultiSearchInput.vue'

    import { computed } from 'vue'

    const props = defineProps({
        context: {
            type: Object,
            required: true,
        },
    })

    const placeholder = computed(() => props.context.placeholder)
    const searchQuery = computed(() => props.context.searchQuery)
    const queryName = computed(() => props.context.queryName)
    const disabled = computed(() => props.context.disabled)

    const handleInput = (value) => {
        props.context.node.input(value)
    }
</script>
