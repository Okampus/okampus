<template>
    <button
        class="flex z-50 shrink-0 justify-center items-center rounded-full button-blue"
        :class="small ? 'w-6 h-6 text-lg' : 'w-10 h-10 text-2xl'"
        @click="slideFunc"
    >
        <i :class="type === 'next' ? 'fas fa-angle-right' : 'fas fa-angle-left'" />
    </button>
</template>

<script setup>
    import { computed } from 'vue'

    const props = defineProps({
        swiper: {
            type: [Object, Array, null],
            required: true,
        },
        small: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            required: true,
        },
    })

    const toArr = (arrOrNot) => (!Array.isArray(arrOrNot) ? [arrOrNot] : arrOrNot)

    const slideFunc = computed(() =>
        props.type === 'next'
            ? () => toArr(props.swiper).forEach((swiper) => swiper.slideNext?.(200))
            : () => toArr(props.swiper).forEach((swiper) => swiper.slidePrev?.(200)),
    )
</script>
