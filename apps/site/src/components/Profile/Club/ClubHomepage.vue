<template>
    <iframe
        class="aspect-[16/9] inline float-left p-5 h-fit md:w-[30rem] md-max:w-full"
        src="https://www.youtube.com/embed/gfxmxDQ6sPM"
        frameborder="0"
        allowfullscreen
    />
    <div class="mb-2 text-xl font-semibold text-1">Qu'est-ce que {{ club.name }} ?</div>
    <div class="md-max:text-lg text-2">{{ club.longDescription }}</div>
</template>

<script setup>
    defineProps({
        club: {
            type: Object,
            required: true,
        },
    })
</script>
