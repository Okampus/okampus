<template>
    <div class="p-4 -mb-4">
        <div v-if="user" class="flex flex-col pb-6 w-[18em] rounded-2xl shadow-2xl bg-0">
            <ProfileBanner class="w-full h-16 rounded-t-lg" :name="fullname(user)" :banner="user.banner" />
            <div class="flex flex-col gap-4 items-start mx-5">
                <div class="flex justify-between w-full">
                    <div class="z-10 p-1 -mt-10 rounded-full bg-1">
                        <ProfileAvatar :avatar="user?.avatar" :size="4.5" :name="fullname(user)" />
                    </div>
                    <!-- TODO: buttons -->
                </div>
                <div class="w-full">
                    <h3 class="text-lg font-semibold line-clamp-1 text-0">
                        {{ fullname(user) }}
                    </h3>
                    <h3 v-if="title" class="text-base line-clamp-1 text-0">
                        {{ title }}
                    </h3>
                </div>
                <div v-if="user.description">
                    <div class="text-sm font-bold uppercase text-3">À propos</div>
                    <div class="text-gray-400 line-clamp-3 text-md">
                        {{ user.description }}
                    </div>
                </div>

                <router-link class="mt-1 text-blue-500 hover:underline" :to="`/user/${user.userId}`">
                    <div class="flex gap-2 text-lg">
                        <i class="pt-1 fas fa-external-link-alt" />
                        <div>Voir le profil</div>
                    </div>
                </router-link>
            </div>
        </div>
        <div v-else class="p-4 bg-2">Utilisateur anonyme</div>
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
