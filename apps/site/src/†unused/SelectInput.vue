<template>
    <Popper placement="bottom-start" offset-distance="0">
        <button class="raised select flex items-center gap-3 py-2 px-3">
            <div
                ref="select"
                class="min-w-fit overflow-hidden whitespace-nowrap"
                :class="currentChoice === -1 ? 'text-placeholder' : 'text-1'"
                :style="maxContentWidth ? `width: ${max}px` : ''"
            >
                {{ currentChoice !== -1 ? choices[currentChoice] : buttonName }}
            </div>
            <div class="flex flex-col">
                <i class="fas fa-chevron-up text-[0.7rem]" />
                <i class="fas fa-chevron-down text-[0.7rem]" />
            </div>
        </button>

        <template #content="{ close }">
            <div class="card-0 z-10 mt-2 max-w-md overflow-hidden p-0 py-2">
                <div class="app-scrollbar max-h-56 overflow-y-auto">
                    <div class="text-placeholder py-1 pl-6 text-lg">
                        {{ buttonName }}
                    </div>
                    <template v-for="(choice, i) in choices" :key="i">
                        <div
                            class="flex cursor-pointer items-center gap-2 rounded px-3 pr-16 text-lg"
                            :class="
                                i === currentChoice
                                    ? 'bg-blue-200 dark:bg-blue-800 font-bold text-1'
                                    : 'hover:bg-blue-100 dark:hover:bg-blue-700 text-0'
                            "
                            @click="emit('update:modelValue', values[i]), close()"
                        >
                            <i v-if="i === currentChoice" class="fas fa-check h-6 w-6 shrink-0 font-bold" />
                            <div>
                                <i :class="'shrink-0 w-6 h-6 font-bold fas fa-' + ico" />
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
        ico: {
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
