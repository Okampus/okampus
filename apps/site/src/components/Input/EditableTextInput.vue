<template>
    <div class="flex flex-col gap-2">
        <div v-if="show" class="mt-4 flex flex-wrap gap-2">
            <div class="input-background relative min-w-[10rem] grow" :="focused ? { focused: '' } : {}">
                <component
                    :is="singleLine ? 'input' : 'textarea'"
                    ref="input"
                    class="input w-full resize-none"
                    :class="textClass"
                    :value="currentValue"
                    @focus="focused = true"
                    @blur="focused = false"
                    @input="updateValue($event)"
                />
                <div
                    v-if="floatingLabel"
                    :class="{ 'floating py-0': focused || currentValue }"
                    class="floating-label rounded-t-md p-1"
                >
                    {{ placeholder }}
                </div>
            </div>
            <div class="flex gap-2 self-start" :class="textClass">
                <button class="button-green mt-1 flex items-center gap-2 py-1.5 text-base" @click="validate">
                    Valider
                </button>
                <button class="button-grey mt-1 flex items-center gap-2 py-1.5 text-base" @click="cancel">
                    Annuler
                </button>
            </div>
        </div>
        <div v-else-if="currentValue" class="text-1 always-break-words" :class="[textClass, displayClass]">
            {{ currentValue }}
            <button
                class="button-blue ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full p-0"
                @click="showInput"
            >
                <i class="fa fa-pen text-xs" />
            </button>
        </div>
        <div v-if="error" class="text-red-500">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
    import { computed, ref } from 'vue'

    const props = defineProps({
        floatingLabel: {
            type: Boolean,
            default: true,
        },
        placeholder: {
            type: String,
            default: 'Écrivez ici...',
        },
        modelValue: {
            type: String,
            default: '',
        },
        showInput: {
            type: Boolean,
            default: false,
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
            default: false,
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
            input.value.style.height = input.value.scrollHeight + 'px'
        }
    }

    const updateValue = (e) => {
        currentValue.value = e.target.value
        resize()
        checkErrors()
    }

    const input = ref(null)
    const initial = ref(props.modelValue)

    const show = computed(() => {
        if (props.showInput || !props.modelValue) {
            resize()
            return true
        }
        return false
    })

    const currentValue = ref(props.modelValue)

    const focused = ref(false)

    const cancel = () => {
        error.value = ''
        currentValue.value = initial.value
        emit('update:modelValue', currentValue.value)
        emit('update:showInput', false)
        emit('cancel')
    }

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

    const showInput = () => {
        emit('update:showInput', true)
        setTimeout(() => {
            if (input.value) {
                input.value.focus()
            }
        }, 100)
    }

    const error = ref('')
</script>
