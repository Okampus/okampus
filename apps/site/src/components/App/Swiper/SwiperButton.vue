<template>
    <button
        class="flex z-50 shrink-0 justify-center items-center rounded-full button-blue"
        :class="small ? 'w-6 h-6 text-lg' : 'w-12 h-12 text-2xl'"
        @click="slideFunc"
    >
        <i :class="type === 'next' ? 'fas fa-angle-right' : 'fas fa-angle-left'" />
    </button>
</template>

<script setup>
    import { computed } from 'vue'

    const props = defineProps({
        swiper: {
            type: [Object, null],
            required: true,
        },
        small: {
            type: Boolean,
            required: false,
        },
        type: {
            type: String,
            required: true,
        },
    })

    const slideFunc = computed(() =>
        props.type === 'next' ? () => props.swiper?.slideNext?.(200) : () => props.swiper?.slidePrev?.(200),
    )
</script>
