<template>
    <div class="relative flex items-center">
        <input
            class="peer input text-3 h-[3rem] w-full pl-[3rem] focus:text-0-light dark:focus:text-0-dark"
            :name="inputName"
            :required="inputRequired"
            :type="inputType"
            :placeholder="inputPlaceholder"
            :value="modelValue"
            @input="emit('update:modelValue', $event.target.value)"
        />
        <i class="text-2 absolute left-0 flex h-[3rem] w-[3rem] items-center justify-center">
            <slot />
        </i>
    </div>
</template>

<script setup>
    import { noop } from 'lodash'

    defineProps({
        inputName: {
            type: String,
            default: '',
        },
        inputType: {
            type: String,
            default: 'text',
        },
        inputPlaceholder: {
            type: String,
            default: '',
        },
        inputRequired: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: String,
            default: '',
        },
        attributes: {
            type: Object,
            default: noop,
        },
    })

    const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss">
    input:-webkit-autofill {
        color: #333 !important;
        box-shadow: 0 0 0 30px #ffa inset !important;

        .dark {
            box-shadow: 0 0 0 30px #ff9 inset !important;
        }
    }

    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        color: black !important;
        box-shadow: 0 0 0 30px #ff9 inset !important;

        .dark {
            box-shadow: 0 0 0 30px #ff5 inset !important;
        }
    }

    input:-webkit-autofill + i {
        color: #333 !important;
    }

    input:-webkit-autofill:focus + i,
    input:-webkit-autofill:active + i {
        color: black !important;
    }
</style>
