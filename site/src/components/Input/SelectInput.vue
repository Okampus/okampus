<template lang="">
    <v-popper
        placement="bottom-start"
        offset-distance="0"
    >
        <button class="raised select py-2 px-3 flex space-x-3">
            <div :class="{'text-placeholder': modelValue.length == 0 || modelValue === undefined}">
                {{ modelValue[0] || buttonName }}
            </div>
            <div class="flex flex-col">
                <i class="ri-arrow-up-s-line -my-1.5" />
                <i class="ri-arrow-down-s-line -my-1.5" />
            </div>
        </button>

        <template #content="{close}">
            <div
                class="z-10 mt-2 max-w-md overflow-hidden card-0 p-0 py-2"
            >
                <div class="overflow-y-auto max-h-56">
                    <div class="text-placeholder text-lg pl-6 py-1">
                        {{ buttonName }}
                    </div>
                    <template
                        v-for="(choice, i) in choices"
                        :key="i"
                    >
                        <div
                            class="px-3 pr-16 rounded cursor-pointer flex text-lg"
                            :class="choice === modelValue[0] && i === modelValue[1] ? 'bg-blue-200 dark:bg-blue-800 font-bold text-0' : 'hover:bg-blue-100 dark:hover:bg-blue-700 text-2'"
                            @click="$emit('update:modelValue', [choice, i]); close();"
                        >
                            <div :class="['h-6 w-6 flex-shrink-0 font-bold', {'ri-check-line': choice === modelValue[0] && i === modelValue[1]}]" />
                            <div>
                                {{ choice }}
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </v-popper>
</template>
<script>
export default {
    props: {
        buttonName: {
            type: String,
            default: 'Choix'
        },
        required: {
            type: Boolean,
            default: false
        },
        inputName: {
            type: String,
            default: ''
        },
        choices: {
            type: Array,
            default: () => []
        },
        modelValue: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:modelValue'],
    computed: {
        attributes() {
            let attributes = {}
            if (this.inputName) {
                attributes.name = this.inputName
            }
            if (this.required) {
                attributes.required = "true"
            }
            return attributes
        }
    }
}
</script>
