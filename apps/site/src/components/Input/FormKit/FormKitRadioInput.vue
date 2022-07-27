<template>
    <RadioInput :choices="choices" :model-value="context._value" @update:model-value="handleInput" />
</template>

<script setup>
    import { computed } from 'vue'
    import RadioInput from '../RadioInput.vue'
    const props = defineProps({
        context: {
            type: Object,
            required: true,
        },
    })

    const choices = computed(() => props.context.choices)

    const handleInput = (value) => {
        props.context.node.input(value)
    }

    const choice = computed(() => props.context.choice)
    if (choice.value) {
        handleInput(choice.value)
    }
</script>
