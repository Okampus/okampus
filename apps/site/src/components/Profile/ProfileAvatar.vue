<template>
    <div class="relative">
        <img
            v-if="avatar"
            :style="avatarSizeStyle"
            loading="lazy"
            class="profile-avatar"
            :src="avatar"
            :alt="`${name}`"
            :title="`Photo de profil de ${name}`"
            :class="[...roundedClass, loaded ? 'text-black' : 'text-transparent']"
            @load="loaded = true"
            @error="loaded = true"
        />
        <div
            v-if="avatar && !loaded"
            class="absolute top-0 left-0 bg-slate-300 dark:bg-slate-600 animate-pulse"
            :class="roundedClass"
            :style="avatarSizeStyle"
        />
        <div
            v-else-if="!avatar"
            role="img"
            :alt="`${name}`"
            :title="`Photo de profil de ${name}`"
            :style="{ ...avatarSizeStyle, backgroundColor: getColorFromData(name) }"
            class="profile-avatar"
            :class="roundedClass"
        >
            <div class="m-auto w-fit h-fit text-white" :style="{ fontSize: `${size / 2.3}rem` }">
                {{ getInitialsFromName(name) }}
            </div>
        </div>
    </div>
</template>

<script setup>
    import { getColorFromData } from '@/utils/colors'
    import { ref } from 'vue'

    const loaded = ref(false)

    const props = defineProps({
        avatar: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            default: 'Anonyme',
        },
        profileLink: {
            type: String,
            default: null,
        },
        size: {
            type: Number,
            default: 3,
        },
        roundedFull: {
            type: Boolean,
            default: true,
        },
    })

    const avatarSizeStyle = {
        width: `${props.size}rem`,
        height: `${props.size}rem`,
    }

    const roundedClass = [props.roundedFull ? 'rounded-full full' : 'rounded-xl']

    const getInitialsFromName = (name) => {
        const nameArray = name.split(' ')
        return (
            nameArray[0].charAt(0) + (nameArray.length > 1 ? nameArray[nameArray.length - 1].charAt(0) : '')
        )
    }
</script>

<style lang="scss">
    .profile-avatar {
        @apply flex shrink-0 justify-center items-center select-none text-center bg-white;

        &::before {
            @apply text-sm h-full w-full block overflow-hidden text-ellipsis rounded-xl mt-3;
        }

        &.full::before {
            @apply rounded-full;
        }

        box-shadow: inset 0 0 7px rgb(0 0 0 / 15%);

        .dark & {
            box-shadow: inset 0 0 5px rgb(255 255 255 / 30%);
        }
    }
</style>
