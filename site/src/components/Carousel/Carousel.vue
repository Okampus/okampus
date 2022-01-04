<template>
    <div
        ref="carousel"
        class="relative bg-1 max-w-md space-x-2 whitespace-nowrap overflow-y-hidden overflow-x-scroll scrollbar-none p-2 "
        @mousemove="sliderScroll($event)"
    >
        <div
            class="w-12 h-full bg-gradient-to-r from-1 absolute left-0 top-0"
            @mousemove="sliderScroll($event)"
        />
        <div
            class="w-12 h-full bg-gradient-to-r to-1 absolute right-0 top-0"
            @mousemove="sliderScroll($event)"
        />
        <span
            v-for="(el, index) in data"
            :key="index"
            class="whitespace-normal bg-red-300 p-2 rounded-full inline-block"
            @mousemove="sliderScroll($event)"
        >
            {{ el }}
        </span>
    </div>
</template>

<script>
export default {
    props:{
        data:{
            type:Array,
            default:()=>[]
        }
    },

    methods: {
        sliderScroll(e, ){
            console.log((e.pageX-this.$refs.carousel.getBoundingClientRect().left)/this.$refs.carousel.getBoundingClientRect().width)
            console.log(this.$refs.carousel.getBoundingClientRect(), this.$refs.carousel.scrollWidth)
            this.$refs.carousel.scrollTo({
                left: (e.pageX-this.$refs.carousel.getBoundingClientRect().left)/this.$refs.carousel.getBoundingClientRect().width*(this.$refs.carousel.scrollWidth-this.$refs.carousel.getBoundingClientRect().width),
                behavior: 'smooth',
            })


        },
    }
}
</script>

<style>

</style>
