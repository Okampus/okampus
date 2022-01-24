<template>
    <Popper placement="bottom-start" offset-distance="0">
        <button class="flex py-2 px-3 space-x-3 raised select">
            <div
                ref="select"
                class="overflow-hidden whitespace-nowrap"
                :class="modelValue === null || modelValue === undefined ? 'text-placeholder' : 'text-1'"
                :style="maxContentWidth ? `width: ${max}px` : ''"
            >
                {{ choices[values.indexOf(modelValue)] || buttonName }}
            </div>
            <div class="flex flex-col">
                <font-awesome-icon :icon="['fas', 'chevron-up']" class="text-xs" />
                <font-awesome-icon :icon="['fas', 'chevron-down']" class="text-xs" />
            </div>
        </button>

        <template #content="{ close }">
            <div class="overflow-hidden z-10 p-0 py-2 mt-2 max-w-md card-0">
                <div class="overflow-y-auto max-h-56 app-scrollbar">
                    <div class="py-1 pl-6 text-lg text-placeholder">
                        {{ buttonName }}
                    </div>
                    <template v-for="(choice, i) in choices" :key="i">
                        <div
                            class="flex gap-2 items-center px-3 pr-16 text-lg rounded cursor-pointer"
                            :class="
                                i === values.indexOf(modelValue)
                                    ? 'bg-blue-200 dark:bg-blue-800 font-bold text-1'
                                    : 'hover:bg-blue-100 dark:hover:bg-blue-700 text-0'
                            "
                            @click="$emit('update:modelValue', values[i]), close()"
                        >
                            <font-awesome-icon
                                v-if="i === values.indexOf(modelValue)"
                                icon="check"
                                class="shrink-0 w-6 h-6 font-bold"
                            />
                            <div>
                                {{ choice }}
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </Popper>
</template>

<script>
import { getTextWidthInElement } from '@/utils/getTextWidth'
import Popper from 'vue3-popper'

export default {
    components: { Popper },
    props: {
        buttonName: {
            type: String,
            default: 'Choix',
        },
        required: {
            type: Boolean,
            default: false,
        },
        maxContentWidth: {
            type: Boolean,
            default: false,
        },
        inputName: {
            type: String,
            default: '',
        },
        choices: {
            type: Array,
            default: () => [],
        },
        values: {
            type: Array,
            default: (props) => [...Array(props.choices.length).keys()],
        },
        modelValue: {
            type: null,
            default: null,
        },
    },
    emits: ['update:modelValue'],
    data() {
        return { max: 0 }
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
    mounted() {
        for (const choice of this.choices) {
            const width = this.getTextWidthInElement(choice, this.$refs.select.$el)
            if (width > this.max) {
                this.max = width
            }
        }
        this.max = Math.ceil(this.max)
    },
    methods: { getTextWidthInElement },
}
</script>
