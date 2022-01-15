<template>
    <div
        v-if="tags.length != 0"
        class="relative flex m-2 items-center"
    >
        <transition name="fade">
            <div
                v-if="leftGradient"
                class="absolute flex justify-center items-center h-full"
            >
                <div
                    class=" flex justify-center items-center h-full bg-1"
                    @click="$refs.scroll.scrollTo({left:$refs.scroll.scrollLeft - 3/4*$refs.scroll.getBoundingClientRect().width, behavior: 'smooth'})"
                >
                    <i class="ri-arrow-left-s-line " />
                </div>

                <div class="w-10 h-full bg-gradient-to-r from-1" />
            </div>
        </transition>

        <div
            ref="scroll"
            class="w-0 basis-full block items-center justify-center gap-2 whitespace-nowrap overflow-y-hidden overflow-x-scroll scrollbar-none space-x-2"
            @scroll.passive="getScroll"
        >
            <div
                v-for="(el, index) in tags"
                :key="index"
                :class="`bg-${el.color}-400`"
                class="whitespace-normal bg-blue-100 hover:bg-blue-200 hover:cursor-pointer text-blue-400 py-1 px-2 rounded-full inline-block"
            >
                {{ el.name }}
            </div>
        </div>

        <transition name="fade">
            <div
                v-if="rightGradient"
                class="absolute right-0 flex justify-center items-center h-full"
            >
                <div class="w-10 h-full bg-gradient-to-r from-transparent to-1" />

                <div
                    class=" flex justify-center items-center h-full bg-1"
                    @click="$refs.scroll.scrollTo({left:$refs.scroll.scrollLeft + 3/4*$refs.scroll.getBoundingClientRect().width, behavior: 'smooth'})"
                >
                    <i class="ri-arrow-right-s-line " />
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props:{
        tags:{
            type: Array,
            required:true
        }
    },
    data() {
        return {
            leftGradient: Boolean,
            rightGradient: Boolean
        }
    },
    mounted() {
        this.getScroll()
    },
    methods: {
        getScroll(){
            if(this.tags.length != 0){
                if(this.$refs.scroll.scrollLeft == 0){
                    this.leftGradient = false
                }else{
                    this.leftGradient = true
                }

                console.log(this.$refs.scroll.scrollLeft, this.$refs.scroll.scrollWidth - this.$refs.scroll.getBoundingClientRect().width)
                if(this.$refs.scroll.scrollLeft == this.$refs.scroll.scrollWidth - this.$refs.scroll.getBoundingClientRect().width){
                    this.rightGradient = false
                }else{
                    this.rightGradient = true
                }
            }
        }
    }
}
</script>
