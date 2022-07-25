<template>
    <div class="-mb-4 p-4">
        <div v-if="user" class="bg-0 flex w-[18em] cursor-default flex-col rounded-2xl pb-6 shadow-2xl">
            <ProfileBanner class="h-16 w-full rounded-t-lg" :name="fullname(user)" :banner="user.banner" />
            <div class="mx-5 flex flex-col items-start gap-4">
                <div class="flex w-full justify-between">
                    <div class="bg-1 z-10 -mt-10 rounded-full p-1">
                        <ProfileAvatar :avatar="user?.avatar" :size="4.5" :name="fullname(user)" />
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

                <router-link class="mt-1 text-blue-500 hover:underline" :to="`/user/${user.id}`">
                    <div class="flex gap-2 text-lg">
                        <i class="fas fa-external-link-alt pt-1" />
                        <div>Voir le profil</div>
                    </div>
                </router-link>
            </div>
        </div>
        <div v-else class="bg-2 p-4">Utilisateur anonyme</div>
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
