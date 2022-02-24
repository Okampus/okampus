<template>
    <div
        class="relative grow bg-transparent"
        v-bind="focused ? { 'focused': 'true' } : {}"
        @click="input.focus()"
    >
        <input
            ref="input"
            type="text"
            class="bottom-border-input"
            :placeholder="inputPlaceholder"
            v-bind="attributes"
            :value="modelValue"
            @blur="focused = false"
            @focus="focused = true"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <span class="flex absolute inset-y-0 right-0 items-center pr-2">
            <slot />
        </span>
    </div>
</template>

<script>
    import { ref } from 'vue'

    export default {
        props: {
            inputName: {
                type: String,
                default: '',
            },
            modelValue: {
                type: String,
                default: '',
            },
            inputPlaceholder: {
                type: String,
                default: 'Entrez du texte...',
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

<style lang="scss">
    :root.light .input-with-icon-shadow {
        box-shadow: inset 0 2px 2px hsl(0deg 0% 0% / 15%), 0 2px 0 hsl(0deg 0% 0% / 5%);
    }
</style>
