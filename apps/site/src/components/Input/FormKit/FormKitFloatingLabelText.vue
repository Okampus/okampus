<template>
    <div class="input-background relative" :="isFocused ? { focused: '' } : {}">
        <component
            :is="isTextarea ? 'textarea' : 'input'"
            class="input w-full"
            :class="inputClass"
            :type="inputType"
            :placeholder="isFocused || context._value ? placeholder : floatingLabel ? '' : placeholder"
            :value="context._value"
            @input="handleInput"
            @focus="isFocused = true"
            @blur="isFocused = false"
        />
        <div
            v-if="floatingLabel"
            :class="{ 'floating': isFocused || context._value }"
            class="floating-label rounded-t-md px-1"
        >
            {{ floatingLabel }}
        </div>
    </div>
</template>

<script setup>
    import { computed, ref } from 'vue'

    const props = defineProps({
        context: {
            type: Object,
            required: true,
        },
    })

    const isFocused = ref(false)

    const floatingLabel = computed(() => props.context.floatingLabel)
    const isTextarea = computed(() => props.context.isTextarea)
    const placeholder = computed(() => props.context.placeholder)
    const inputClass = computed(() => props.context.inputClass)
    const inputType = computed(() => props.context.inputType)

    const handleInput = (e) => {
        props.context.node.input(e.target.value)
    }
</script>
