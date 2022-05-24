<template>
    <img
        v-if="avatar"
        :style="{
            width: `${size}rem`,
            height: `${size}rem`,
        }"
        loading="lazy"
        class="profile-avatar"
        :src="avatar"
        :alt="`${name}`"
        :title="`Photo de profil de ${name}`"
        :class="[roundedFull ? 'rounded-full full' : 'rounded-xl']"
    />

    <div
        v-else
        role="img"
        :alt="`${name}`"
        :title="`Photo de profil de ${name}`"
        :style="{
            width: `${size}rem`,
            height: `${size}rem`,
            backgroundColor: getColorFromData(name),
        }"
        class="profile-avatar"
        :class="[roundedFull ? 'rounded-full full' : 'rounded-xl']"
    >
        <div class="m-auto w-fit h-fit text-white" :style="{ fontSize: `${size / 2.3}rem` }">
            {{ getInitialsFromName(name) }}
        </div>
    </div>
</template>

<script setup>
    import { getColorFromData } from '@/utils/colors'

    defineProps({
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
            @apply text-sm h-full block overflow-hidden text-ellipsis rounded-xl text-black;
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
