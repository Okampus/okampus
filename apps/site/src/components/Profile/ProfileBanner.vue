<template>
    <div class="relative">
        <img
            v-if="banner"
            loading="lazy"
            :src="banner"
            :alt="`${name}`"
            class="profile-banner"
            :class="[roundedTop ? 'rounded-t-lg' : '', loaded ? 'text-black' : 'text-transparent']"
            :title="`Bannière de ${name}`"
            @load="loaded = true"
            @error="loaded = true"
        />
        <div
            v-if="banner && !loaded"
            :class="roundedTop ? 'rounded-t-lg' : ''"
            class="absolute top-0 left-0 w-full h-full bg-slate-300 dark:bg-slate-600 animate-pulse"
        />
        <div
            v-else-if="!banner"
            role="img"
            class="profile-banner"
            :class="roundedTop ? 'rounded-t-lg' : ''"
            :alt="`${name}`"
            :title="`Bannière de ${name}`"
            :style="{ backgroundColor: getColorFromData(data ?? name) }"
        />
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    import { getColorFromData } from '@/utils/colors'

    const loaded = ref(false)

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
        roundedTop: {
            type: Boolean,
            default: true,
        },
    })
</script>

<style lang="scss">
    .profile-banner {
        @apply text-center bg-white w-full h-full;

        &::before {
            @apply text-xs h-[calc(100%-0.6rem)] block overflow-hidden text-ellipsis mt-2 w-full;
        }
    }
</style>
