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
            class="absolute top-0 left-0 h-full w-full animate-pulse bg-slate-300 dark:bg-slate-600"
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
            @apply text-xs h-full block overflow-hidden text-ellipsis pt-2 w-full;
        }
    }
</style>
