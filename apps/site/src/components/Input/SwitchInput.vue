<template>
    <label
        class="switch"
        :style="{
            '--switch-width': width,
            '--switch-height': height,
            '--switch-color': switchValidateColor,
            '--switch-bg': switchBackgroundColor,
            '--switch-inner-padding': switchInnerPadding,
            '--button-color': buttonColor,
            '--button-radius': buttonRadius,
            '--transition-duration': transitionDuration,
        }"
    >
        <input
            :checked="modelValue"
            type="checkbox"
            @change="emit('update:modelValue', $event.target.checked)"
        />
        <span class="slider round" />
    </label>
</template>

<script setup>
    defineProps({
        modelValue: {
            type: Boolean,
            required: true,
        },
        width: {
            type: String,
            default: '3rem',
        },
        height: {
            type: String,
            default: '1.5rem',
        },
        switchValidateColor: {
            type: String,
            default: 'orange',
        },
        switchBackgroundColor: {
            type: String,
            default: '#ccc',
        },
        switchInnerPadding: {
            type: String,
            default: '0.2rem',
        },
        buttonColor: {
            type: String,
            default: '#fff',
        },
        buttonRadius: {
            type: String,
            default: '9999px',
        },
        transitionDuration: {
            type: String,
            default: '0.35s',
        },
    })

    const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
    .switch {
        position: relative;
        display: inline-block;
        flex-shrink: 0;
        width: var(--switch-width);
        height: var(--switch-height);

        & input {
            width: var(--switch-width);
            height: var(--switch-height);
            cursor: pointer;
            opacity: 0;
        }
    }

    .slider {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: var(--switch-width);
        height: var(--switch-height);
        pointer-events: none;
        background-color: var(--switch-bg);
        border-radius: var(--button-radius);
        transition: var(--transition-duration);

        &::before {
            position: absolute;
            top: var(--switch-inner-padding);
            left: var(--switch-inner-padding);
            width: calc(var(--switch-height) - 2 * var(--switch-inner-padding));
            height: calc(var(--switch-height) - 2 * var(--switch-inner-padding));
            content: '';
            background-color: var(--button-color);
            border-radius: var(--button-radius);
            transition: var(--transition-duration);
        }
    }

    input:checked + .slider {
        background-color: var(--switch-color);
    }

    input:focus + .slider {
        box-shadow: 0 0 1px var(--switch-color);
    }

    input:checked + .slider::before {
        transform: translateX(calc(var(--switch-width) - var(--switch-height)));
    }
</style>
