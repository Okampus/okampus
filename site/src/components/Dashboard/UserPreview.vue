<template>
    <div class="flex items-center">
        <div class="relative hidden w-10 h-10 mr-3 rounded-full md:block">
            <img
                class="object-cover w-full h-full rounded-full"
                :src="avatar"
                :alt="username"
                loading="lazy"
            >
            <div
                class="absolute inset-0 rounded-full shadow-inner"
                aria-hidden="true"
            />
        </div>
        <div>
            <p class="font-semibold whitespace-nowrap text-0">
                {{ username }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ abbrNumbers(reputation) }}
            </p>
        </div>
    </div>
</template>

<script>
import default_avatar from '@/assets/img/default_avatars/user.png'
import { abbrNumbers } from '@/utils/abbrNumbers'

export default {
    props: {
        username: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: default_avatar
        },
        reputation: {
            type: Number,
            default: 0
        }
    },
    methods: {
        abbrNumbers
    }
}
</script>
