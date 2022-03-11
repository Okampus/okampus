<template>
    <div v-if="tags.length != 0" ref="parent" class="flex relative items-center m-2">
        <Transition name="fade">
            <div v-if="leftGradient" class="flex absolute justify-center items-center h-full">
                <div
                    class="flex justify-center items-center h-full cursor-pointer bg-1"
                    @click="
                        $refs.scroll.scrollTo({
                            left:
                                $refs.scroll.scrollLeft -
                                (3 / 4) * $refs.scroll.getBoundingClientRect().width,
                            behavior: 'smooth',
                        })
                    "
                >
                    <i class="fas fa-chevron-left text-0" />
                </div>

                <div class="w-10 h-full bg-gradient-to-r from-1" />
            </div>
        </Transition>

        <div
            ref="scroll"
            class="block overflow-x-scroll overflow-y-hidden basis-full gap-2 justify-center items-center space-x-2 w-0 whitespace-nowrap scrollbar-none"
            @scroll.passive="getScroll"
        >
            <div v-for="(el, index) in tags" :key="index" class="inline-block">
                <AppTag :tag-name="el.name" :tag-color="el.color" />
            </div>
        </div>

        <Transition name="fade">
            <div v-if="rightGradient" class="flex absolute right-0 justify-center items-center h-full">
                <div class="w-10 h-full bg-gradient-to-r from-transparent to-1" />

                <div class="flex justify-center items-center h-full cursor-pointer bg-1" @click="scrollTo()">
                    <i class="fas fa-chevron-right text-0" />
                </div>
            </div>
        </Transition>
    </div>
    <div v-else>
        <p class="italic text-0">Aucun tag</p>
    </div>
</template>

<script>
    import AppTag from '@/components/App/AppTag.vue'
    export default {
        components: { AppTag },
        props: {
            tags: {
                type: Array,
                required: true,
            },
        },
        data() {
            return {
                leftGradient: false,
                rightGradient: false,
            }
        },
        mounted() {
            this.getScroll()
        },
        methods: {
            scrollTo() {
                this.$refs.scroll.scrollTo({
                    left:
                        this.$refs.scroll.scrollLeft +
                        (3 / 4) * this.$refs.scroll.getBoundingClientRect().width,
                    behavior: 'smooth',
                })
            },
            getScroll() {
                if (this.tags.length != 0) {
                    this.leftGradient = this.$refs.scroll.scrollLeft != 0
                    this.rightGradient =
                        this.$refs.scroll.scrollLeft + 1 <
                        this.$refs.scroll.scrollWidth - this.$refs.parent.getBoundingClientRect().width
                }
            },
        },
    }
</script>
