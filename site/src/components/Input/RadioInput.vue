<template>
    <div class="flex justify-between rounded divide-x cursor-pointer bg-1 divide-color-0 raised">
        <button
            v-for="(choice, i) in choices"
            :key="i"
            class="focus:z-50 w-full"
            :class="[modelValue == choice.key ? 'z-10' : '']"
            @click="$emit('update:modelValue', choice.key)"
        >
            <div
                class="p-2 w-full h-full text-center rounded"
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
    methods: {
        test(a) {
            console.log(this.$refs[a].checked)
            console.log(this.modelValue)
        },
    },
}
</script>
