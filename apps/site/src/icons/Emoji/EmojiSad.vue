<template>
    <EmojiBase :type="sadFace.type" :emoji="sadFace.emoji" />
</template>

<script setup>
    import EmojiBase from '@/icons/Emoji/EmojiBase.vue'
    import sadFacesEnum from '@/shared/types/sad-faces.enum'
    const sadFace = sadFacesEnum[Math.floor(Math.random() * (sadFacesEnum.length - 1))]
</script>
