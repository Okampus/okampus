<template>
    <div class="flex space-x-4 items-center">
        <div class="relative w-11 h-11">
            <div>
                <AvatarImage
                    :size="11"
                    :src="avatar"
                    :alt="username"
                />
            </div>
        </div>
        <div class="flex flex-col min-w-0">
            <router-link
                class="font-semibold truncate hover:underline"
                :to="`/users/${$store.state.auth.user.userId}`"
            >
                {{ username }}
            </router-link>
            <div class="truncate">
                {{ email }}
            </div>
        </div>
        <div class="flex flex-col items-center justify-center space-y-2">
            <router-link
                to="/users/me"
            >
                <font-awesome-icon
                    icon="cog"
                    class="cursor-pointer"
                />
            </router-link>
            <font-awesome-icon
                icon="sign-out-alt"
                class="cursor-pointer"
                @click="logout"
            />
        </div>
    </div>
</template>

<script lang="js">
import AvatarImage from '@/components/AvatarImage.vue'
export default {
    components: { AvatarImage },
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
            default: ''
        },
        status: {
            type: String,
            default: "#44ef44"
        }
    },
    methods: {
        logout() {
            this.emitter.emit("logout");
            this.$store.dispatch("auth/logout");
        }
    }
}
</script>
