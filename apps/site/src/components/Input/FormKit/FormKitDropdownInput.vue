<template>
    <DropdownInput
        :placeholder="placeholder"
        :default-option="defaultOption"
        :options="options"
        :update="update"
        :model-value="context._value?.value ?? context._value"
        @update:model-value="handleInput"
    />
</template>

<script setup>
    import { computed } from 'vue'
    import DropdownInput from '@/components/Input/DropdownInput.vue'

    const props = defineProps({
        context: {
            type: Object,
            required: true,
        },
    })

    const placeholder = computed(() => props.context.placeholder)
    const defaultOption = computed(() => props.context.defaultOption)
    const update = computed(() => props.context.update)
    const options = computed(() => props.context.options)

    const handleInput = (value) => {
        props.context.node.input(value)
    }
</script>
