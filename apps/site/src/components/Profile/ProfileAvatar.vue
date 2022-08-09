<template>
    <router-link
        :to="profileLink"
        :="
            !clickable || !profileLink.length
                ? { custom: true }
                : { class: ['shrink-0', props.class], style: avatarSizeStyle }
        "
    >
        <div
            class="relative shrink-0 before:absolute before:inset-px before:bg-white"
            :class="[!clickable || !profileLink.length ? props.class : '', ...roundedBeforeClass]"
            :style="avatarSizeStyle"
        >
            <img
                v-if="avatar"
                loading="lazy"
                class="profile-avatar"
                :src="avatar"
                :alt="`${name}`"
                :title="`Photo de profil de ${name}`"
                :class="[innerClass, ...roundedClass, loaded ? 'text-black' : 'text-transparent']"
                @load="loaded = true"
                @error="loaded = true"
            />
            <div
                v-if="avatar && !loaded"
                class="absolute inset-0 animate-pulse bg-slate-300 dark:bg-slate-600"
                :class="[innerClass, roundedClass]"
            />
            <div
                v-else-if="!avatar"
                role="img"
                :alt="`${name}`"
                :title="`Photo de profil de ${name}`"
                :style="{ backgroundColor: getColorFromData(name) }"
                class="profile-avatar text-base"
                :class="[innerClass, roundedClass]"
            >
                <div class="m-auto h-fit w-fit text-white" :style="{ fontSize: `${size / 2.5}rem` }">
                    {{ getInitialsFromName(name) }}
                </div>
            </div>
            <slot v-if="$slots.icon" name="icon" />
        </div>
    </router-link>
</template>

<script setup>
    import { getColorFromData } from '@/utils/colors'
    import { computed, ref } from 'vue'

    const loaded = ref(false)

    const props = defineProps({
        id: {
            type: [String, Number],
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
        class: {
            type: [String, Array, Object],
            default: '',
        },
        name: {
            type: String,
            default: 'Anonyme',
        },
        size: {
            type: Number,
            default: 3,
        },
        roundedFull: {
            type: Boolean,
            default: true,
        },
        innerClass: {
            type: [String, Array, Object],
            default: '',
        },
        type: {
            type: String,
            default: 'user',
        },
        link: {
            type: String,
            default: null,
        },
        clickable: {
            type: Boolean,
            default: true,
        },
    })

    const avatarSizeStyle = computed(() => ({
        width: `${props.size}rem`,
        height: `${props.size}rem`,
    }))

    const roundedClass = [props.roundedFull ? 'rounded-full' : 'rounded-xl']
    const roundedBeforeClass = [props.roundedFull ? 'before:rounded-full' : 'before:rounded-xl']

    const profileLink = computed(() => {
        if (props.link) return props.link
        if (!props.id) return ''
        if (props.type === 'user') return `/user/${props.id}`
        if (props.type === 'club') return `/club/${props.id}`
        if (props.type === 'team') return `/team/${props.id}`
        return ''
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
        @apply absolute inset-0 h-full w-full flex shrink-0 justify-center items-center select-none text-center overflow-hidden;

        &::before {
            @apply text-xs block overflow-hidden text-ellipsis px-2;
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
