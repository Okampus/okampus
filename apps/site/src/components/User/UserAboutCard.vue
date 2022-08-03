<template>
    <div class="bg-0 flex w-[18em] cursor-default flex-col rounded-lg pb-6 shadow-2xl">
        <ProfileBanner class="h-16 w-full" :name="fullname(user)" :banner="user.banner" />
        <div class="mx-5 flex flex-col items-start gap-4">
            <div class="flex w-full justify-between">
                <div class="bg-1 z-10 -mt-10 rounded-full p-1">
                    <ProfileAvatar :avatar="user?.avatar" :size="5" :name="fullname(user)" />
                </div>
                <!-- TODO: buttons -->
            </div>
            <div class="w-full">
                <h3 class="text-0 text-lg font-semibold line-clamp-1">
                    {{ fullname(user) }}
                </h3>
                <h3 v-if="title" class="text-0 text-base line-clamp-1">
                    {{ title }}
                </h3>
            </div>
            <div v-if="user.description">
                <div class="text-3 text-sm font-bold uppercase">À propos</div>
                <div class="text-md text-gray-400 line-clamp-3">
                    {{ user.description }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { fullname } from '@/utils/users'

    defineProps({
        title: {
            type: String,
            default: null,
        },
        user: {
            type: Object,
            default: () => ({}),
        },
    })
</script>
