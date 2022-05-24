<template>
    <EmojiBase :type="sadEmoji.type" :emoji="sadEmoji.emoji" />
</template>

<script setup>
    import EmojiBase from '@/icons/Emoji/EmojiBase.vue'
    import sadEmojis from '@/shared/assets/sad-emojis'
    const sadEmoji = sadEmojis[Math.floor(Math.random() * (sadEmojis.length - 1))]
</script>
