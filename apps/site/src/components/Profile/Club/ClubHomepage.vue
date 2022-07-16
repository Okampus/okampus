<template>
    <div>
        <iframe
            class="aspect-[16/9] inline float-left pr-6 pb-6 h-fit"
            :class="club.longDescription ? 'md:w-[30rem] md-max:mb-4 md-max:w-full' : 'w-full'"
            src="https://www.youtube.com/embed/gfxmxDQ6sPM"
            frameborder="0"
            allowfullscreen
        />
        <div v-if="club.longDescription">
            <div class="mb-4 text-xl font-semibold md-max:text-2xl text-1">
                Qu'est-ce que {{ club.name }} ?
            </div>
            <MdRenderer class="space-y-4 md-max:text-lg text-2" :content="club.longDescription" />
        </div>
    </div>
</template>

<script setup>
    import MdRenderer from '@/components/Input/Editor/MdRenderer.vue'
    defineProps({
        club: {
            type: Object,
            required: true,
        },
    })
</script>
