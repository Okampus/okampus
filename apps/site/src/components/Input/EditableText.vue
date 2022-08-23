<template>
    <div class="flex flex-col gap-2">
        <component
            :is="singleLine ? 'input' : 'textarea'"
            ref="input"
            class="w-full resize-none border-none bg-transparent outline-none"
            :class="[textClass, focused ? 'input' : 'pl-3 py-2', displayClass]"
            :value="currentValue"
            :placeholder="placeholder"
            @focus="updateFocus"
            @blur="
                () => {
                    focused = false
                    validate()
                }
            "
            @input="updateValue($event)"
        />
        <div v-if="error" class="text-red-500">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    const props = defineProps({
        placeholder: {
            type: String,
            default: 'Écrivez ici...',
        },
        modelValue: {
            type: String,
            default: '',
        },
        minChar: {
            type: Number,
            default: 0,
        },
        maxChar: {
            type: Number,
            default: null,
        },
        minCharMessage: {
            type: String,
            default: (props) => `Ce champ doit contenir au moins ${props.minChar} caractères.`,
        },
        maxCharMessage: {
            type: String,
            default: (props) => `Ce champ doit contenir au plus ${props.maxChar} caractères.`,
        },
        textClass: {
            type: String,
            default: 'text-base',
        },
        displayClass: {
            type: String,
            default: '',
        },
        singleLine: {
            type: Boolean,
            default: true,
        },
    })

    const emit = defineEmits(['update:modelValue', 'update:showInput', 'validate', 'cancel'])

    const checkErrors = () => {
        if (props.minChar && currentValue.value.length < props.minChar) {
            error.value = props.minCharMessage
            return true
        }
        if (props.maxChar && currentValue.value.length > props.maxChar) {
            error.value = props.maxCharMessage
            return true
        }
        error.value = ''
        return false
    }

    const resize = () => {
        if (!props.singleLine && input.value) {
            input.value.style.height = '1px'
            input.value.style.height = input.value.scrollHeight + 20 + 'px'
        }
    }

    const updateFocus = () => {
        focused.value = true
        resize()
        currentValue.value = currentValue.value.toString()
    }

    const updateValue = (e) => {
        currentValue.value = e.target.value
        resize()
        checkErrors()
    }

    const input = ref(null)
    const initial = ref(props.modelValue)

    const focused = ref(false)
    defineExpose({ input })

    const currentValue = ref(props.modelValue)

    const validate = () => {
        if (!checkErrors()) {
            if (initial.value !== currentValue.value) {
                emit('update:modelValue', currentValue.value)
                emit('validate', currentValue.value)
                initial.value = currentValue.value
            }
            emit('update:showInput', false)
        }
    }
    const error = ref('')
</script>
