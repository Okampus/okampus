<template>
    <div
        class="text-2 bg-1 divide-color-0 raised flex cursor-pointer items-stretch justify-center divide-x rounded"
        :class="[fullWidth ? 'w-full' : 'w-fit']"
    >
        <button
            v-for="(choice, i) in choices"
            :key="i"
            class="flex flex-col items-center justify-center rounded px-4 focus:z-50"
            :class="[
                modelValue == choice.key
                    ? 'bg-blue-500 text-white ring-1 ring-blue-500 !border-transparent'
                    : '',
                small ? 'text-sm py-1 gap-0.5' : 'text-base py-2 gap-1',
                fullWidth ? 'w-full' : '',
            ]"
            @click="$emit('update:modelValue', choice.key)"
        >
            <div>
                {{ choice.name }}
                <span v-if="choice.subtitle" :class="[small ? 'text-xs' : 'text-sm']" class="font-semibold">
                    ({{ choice.subtitle }})
                </span>
            </div>
        </button>
    </div>
</template>

<script setup>
    defineProps({
        choices: {
            type: Array,
            required: true,
        },
        modelValue: {
            type: String,
            default: null,
        },
        fullWidth: {
            type: Boolean,
            default: false,
        },
        small: {
            type: Boolean,
            default: false,
        },
    })

    defineEmits(['update:modelValue'])
</script>
