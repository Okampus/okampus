<template>
    <div v-if="mode == 'horizontal'" class="flex items-center">
        <div
            class="hidden relative mr-3 w-10 h-10 rounded-full md:block"
            :class="`w-${imgSize} h-${imgSize}`"
        >
            <img
                class="object-cover w-full h-full rounded-full"
                :src="avatar ?? defaultAvatar"
                :alt="username"
                loading="lazy"
            />
        </div>
        <div>
            <p class="whitespace-nowrap" :class="textClass">
                {{ username }}
            </p>
            <p v-if="reputation !== null" class="text-sm text-gray-600 dark:text-gray-400">
                {{ abbrNumbers(reputation) }}
            </p>
        </div>
    </div>
    <div v-else>
        <div class="flex flex-col items-center">
            <img
                :src="avatar || defaultAvatar"
                alt="Profile Picture"
                :class="`w-${imgSize} h-${imgSize}`"
                class="mt-2 rounded-full"
            />
            <div class="font-medium text-center" :class="textClass">
                {{ username }}
            </div>
            <p v-if="reputation !== null" class="text-sm text-gray-600 dark:text-gray-400">
                {{ abbrNumbers(reputation) }}
            </p>
        </div>
    </div>
</template>

<script>
    import defaultAvatar from '@/assets/img/default_avatars/user.png'
    import { abbrNumbers } from '@/utils/abbrNumbers'

    export default {
        props: {
            username: {
                type: String,
                default: '',
            },
            avatar: {
                type: String,
                default: null,
            },
            reputation: {
                type: Number,
                default: null,
            },
            mode: {
                type: String,
                default: 'horizontal',
            },
            imgSize: {
                type: Number,
                default: 14,
            },
            textClass: {
                type: String,
                default: 'text-base text-0',
            },
            textClassInfo: {
                type: String,
                default: 'text-sm text-gray-600 dark:text-gray-400',
            },
        },
        data() {
            return { defaultAvatar }
        },
        methods: { abbrNumbers },
    }
</script>
