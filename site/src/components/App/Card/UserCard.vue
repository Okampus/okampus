<template>
    <div class="flex gap-3 items-center">
        <UserAvatar :img-src="user.avatar" :username="user.fullname" />

        <div class="flex flex-col min-w-0 text-white">
            <router-link class="font-semibold hover:underline truncate" :to="`/users/${user.userId}`">
                {{ user.fullname }}
            </router-link>
            <div class="truncate">
                {{ user.email }}
            </div>
        </div>
        <div class="flex flex-col justify-center items-center space-y-2 text-white">
            <router-link to="/me/profile">
                <i class="cursor-pointer fas fa-cog" />
            </router-link>
            <i class="cursor-pointer fas fa-sign-out-alt" @click="emitter.emit('logout')" />
        </div>
    </div>
</template>

<script setup>
    import UserAvatar from '@/components/User/UserAvatar.vue'
    import { emitter } from '@/shared/modules/emitter'

    defineProps({
        user: {
            type: Object,
            required: true,
        },
    })
</script>
