<template>
    <div
        class="input-with-icon"
        :class="`h-${height}`"
        tabindex="0"
        :="focused ? { 'focused': 'true' } : {}"
        @focus="input.focus()"
    >
        <i :class="`w-${height}`">
            <slot />
        </i>

        <input
            ref="input"
            :name="inputName"
            :value="modelValue"
            :type="inputType"
            :placeholder="inputPlaceholder"
            :="attributes"
            @blur="focused = false"
            @focus="focused = true"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>

<script lang="js">

import { ref } from 'vue'
export default {
    props: {
        height: {
            type: String,
            default: '10',
        },
        inputName: {
            type: String,
            default: '',
        },
        inputPlaceholder: {
            type: String,
            default: 'Entrez du texte...',
        },
        inputType: {
            type: String,
            default: 'text',
        },
        modelValue: {
            type: String,
            default: '',
        },
        required: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    setup() {
        return { input: ref(null) }
    },
    data() {
        return { focused: false }
    },
    computed: {
        attributes() {
            let attributes = {}
            if (this.inputName) {
                attributes.name = this.inputName
            }
            if (this.required) {
                attributes.required = 'true'
            }
            return attributes
        },
    },
}
</script>
