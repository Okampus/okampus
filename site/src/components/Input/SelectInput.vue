<template>
    <Popper placement="bottom-start" offset-distance="0">
        <button class="flex gap-3 items-center py-2 px-3 raised select">
            <div
                ref="select"
                class="overflow-hidden min-w-fit whitespace-nowrap"
                :class="currentChoice === -1 ? 'text-placeholder' : 'text-1'"
                :style="maxContentWidth ? `width: ${max}px` : ''"
            >
                {{ currentChoice !== -1 ? choices[currentChoice] : buttonName }}
            </div>
            <div class="flex flex-col">
                <i class="text-[0.7rem] fas fa-chevron-up" />
                <i class="text-[0.7rem] fas fa-chevron-down" />
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
                                i === currentChoice
                                    ? 'bg-blue-200 dark:bg-blue-800 font-bold text-1'
                                    : 'hover:bg-blue-100 dark:hover:bg-blue-700 text-0'
                            "
                            @click="emit('update:modelValue', values[i]), close()"
                        >
                            <i v-if="i === currentChoice" class="shrink-0 w-6 h-6 font-bold fas fa-check" />
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

<script setup>
    import { getTextWidthInElement } from '@/utils/getTextWidth'
    import { computed, onMounted, ref } from 'vue'
    import Popper from 'vue3-popper'
    import isEqual from 'lodash/isEqual'

    const props = defineProps({
        buttonName: {
            type: String,
            default: 'Choix',
        },
        choices: {
            type: Array,
            default: () => [],
        },
        maxContentWidth: {
            type: Number,
            default: null,
        },
        modelValue: {
            type: null,
            default: null,
        },
        values: {
            type: Array,
            default: (props) => [...Array(props.choices.length).keys()],
        },
    })

    const emit = defineEmits(['update:modelValue'])

    const select = ref(null)

    const max = ref(0)
    onMounted(() => {
        let _max = 0
        for (const choice of props.choices) {
            const width = getTextWidthInElement(choice, select.value.$el)
            if (width > _max) {
                _max = width
            }
        }

        max.value = Math.ceil(props.maxContentWidth || _max)
    })

    const currentChoice = computed(() => props.values.findIndex((el) => isEqual(el, props.modelValue)))
</script>
