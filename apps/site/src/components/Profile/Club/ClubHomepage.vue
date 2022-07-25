<template>
    <div>
        <iframe
            class="float-left inline aspect-[16/9] h-fit pr-6 pb-6"
            :class="club.longDescription ? 'md:w-[30rem] md-max:mb-4 md-max:w-full' : 'w-full'"
            src="https://www.youtube.com/embed/gfxmxDQ6sPM"
            frameborder="0"
            allowfullscreen
        />
        <div v-if="club.longDescription">
            <div class="text-1 mb-4 text-xl font-semibold md-max:text-2xl">
                Qu'est-ce que {{ club.name }} ?
            </div>
            <MdRenderer class="text-2 space-y-4 md-max:text-lg" :content="club.longDescription" />
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
