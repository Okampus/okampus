<template>
    <div v-if="tags.length != 0" ref="parent" class="relative flex items-center">
        <Transition name="fade">
            <div v-if="leftGradient" class="absolute flex h-full items-center justify-center">
                <div
                    class="bg-1 flex h-full cursor-pointer items-center justify-center"
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

                <div class="from-1 h-full w-10 bg-gradient-to-r" />
            </div>
        </Transition>

        <div
            ref="scroll"
            class="scrollbar-none block w-0 basis-full items-center justify-center gap-2 space-x-2 overflow-y-hidden overflow-x-scroll whitespace-nowrap"
            @scroll.passive="getScroll"
        >
            <div v-for="(el, index) in tags" :key="index" class="inline-block">
                <LabelTag :tag-name="el.name" :tag-color="el.color" />
            </div>
        </div>

        <Transition name="fade">
            <div v-if="rightGradient" class="absolute right-0 flex h-full items-center justify-center">
                <div class="to-1 h-full w-10 bg-gradient-to-r from-transparent" />

                <div class="bg-1 flex h-full cursor-pointer items-center justify-center" @click="scrollTo()">
                    <i class="fas fa-chevron-right text-0" />
                </div>
            </div>
        </Transition>
    </div>
    <div v-else>
        <p class="text-0 italic">Aucun tag</p>
    </div>
</template>

<script>
    import LabelTag from '@/components/UI/Label/LabelTag.vue'

    export default {
        components: { LabelTag },
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
