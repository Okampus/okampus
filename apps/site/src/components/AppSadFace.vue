<template>
    <AppEmoji :type="sadFace.type" :emoji="sadFace.emoji" />
</template>

<script setup>
    import AppEmoji from '@/components/App/AppEmoji.vue'
    import sadFacesEnum from '@/shared/types/sad-faces.enum'
    const sadFace = sadFacesEnum[Math.floor(Math.random() * (sadFacesEnum.length - 1))]
</script>
