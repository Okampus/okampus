<template>
    <img
        v-if="banner"
        loading="lazy"
        :src="banner"
        :alt="`${name}`"
        class="profile-banner"
        :title="`Bannière de ${name}`"
    />
    <div
        v-else
        role="img"
        class="profile-banner"
        :alt="`${name}`"
        :title="`Bannière de ${name}`"
        :style="{ backgroundColor: getColorFromData(data ?? name) }"
    />
</template>

<script setup>
    import { getColorFromData } from '@/utils/colors'

    defineProps({
        banner: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            default: 'Anonyme',
        },
        // A string data field used to determine the banner color
        data: {
            type: String,
            default: null,
        },
    })
</script>

<style lang="scss">
    .profile-banner {
        @apply text-center bg-white text-black;

        &::before {
            @apply text-sm h-full block overflow-hidden text-ellipsis;
        }
    }
</style>
