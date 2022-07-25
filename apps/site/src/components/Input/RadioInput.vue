<template>
    <div class="bg-1 divide-color-0 raised flex cursor-pointer justify-between divide-x rounded">
        <button
            v-for="(choice, i) in choices"
            :key="i"
            class="w-full focus:z-50"
            :class="[modelValue == choice.key ? 'z-10' : '']"
            @click="$emit('update:modelValue', choice.key)"
        >
            <div
                class="h-full w-full rounded p-2 text-center"
                :class="[modelValue == choice.key ? 'bg-blue-500 text-white ring-2 ring-blue-500' : '']"
            >
                {{ choice.name }}
            </div>
        </button>
    </div>
</template>

<script>
    export default {
        props: {
            choices: {
                type: Array,
                required: true,
            },
            modelValue: {
                type: null,
                required: true,
            },
        },
        emits: ['update:modelValue'],
    }
</script>
