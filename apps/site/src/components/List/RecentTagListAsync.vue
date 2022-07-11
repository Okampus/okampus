<template>
    <div v-if="!swipe" class="flex flex-wrap gap-4">
        <LabelTag v-for="(tag, i) in threads.tags" :key="i" class="inline text-xs" :tag-name="tag.name" />
    </div>
    <div v-else class="flex items-center mx-5">
        <SwiperButton type="prev" :swiper="swiper" :small="true" />
        <Swiper slides-per-view="auto" :space-between="10" class="items-start" @swiper="(s) => (swiper = s)">
            <SwiperSlide v-for="(tag, i) in threads.tags" :key="i" class="max-w-[15rem]">
                <LabelTag :key="i" class="inline text-xs" :tag-name="tag.name" />
            </SwiperSlide>
        </Swiper>
        <SwiperButton type="next" :swiper="swiper" :small="true" />
    </div>
</template>

<script setup>
    import LabelTag from '@/components/UI/Label/LabelTag.vue'
    import SwiperButton from '../App/Swiper/SwiperButton.vue'
    import { Swiper, SwiperSlide } from 'swiper/vue'

    import { useThreadsStore } from '@/store/threads.store'
    import { ref } from 'vue'

    defineProps({ swipe: { type: Boolean, default: false } })

    const swiper = ref(null)

    const threads = useThreadsStore()
    await threads.getTags({ itemsPerPage: 100 })
</script>
