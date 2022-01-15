<template>
    <div class="flex space-x-4 items-center">
        <div class="relative w-11 h-11">
            <div>
                <img
                    class="rounded-2xl"
                    :src="avatar"
                    :alt="username"
                >
            </div>
            <!-- <span
                class="w-1/3 h-1/3 absolute bottom-0 right-0 rounded-full border border-white"
                :style="{backgroundColor: status}"
            /> -->
        </div>
        <div class="flex flex-col min-w-0">
            <router-link
                class="font-semibold truncate hover:underline"
                :to="`/profile/${$store.state.auth.user.userId}`"
            >
                {{ username }}
            </router-link>
            <div class="truncate">
                {{ email }}
            </div>
        </div>
        <div class="flex flex-col items-center justify-center space-y-2">
            <router-link
                to="/settings"
            >
                <i class="ri-settings-4-line cursor-pointer" />
            </router-link>
            <i
                class="ri-logout-box-line cursor-pointer"
                @click="logout"
            />
        </div>
    </div>
</template>

<script lang="js">
import default_avatar from '@/assets/img/default_avatars/user.png'
export default {
    props: {
        username: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: default_avatar
        },
        status: {
            type: String,
            default: '#44ef44'
        }
    },
    methods: {
        logout () {
            this.emitter.emit('logout')
            this.$store.dispatch('auth/logout')
        }
    }
}
</script>
