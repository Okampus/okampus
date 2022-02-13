<template>
    <div class="flex gap-3 items-center">
        <UserAvatar :img-src="avatar" :username="username" />

        <div class="flex flex-col min-w-0">
            <router-link
                class="font-semibold hover:underline truncate"
                :to="`/users/${$store.state.auth.user.userId}`"
            >
                {{ username }}
            </router-link>
            <div class="truncate">
                {{ email }}
            </div>
        </div>
        <div class="flex flex-col justify-center items-center space-y-2">
            <router-link to="/me/profile">
                <font-awesome-icon icon="cog" class="cursor-pointer" />
            </router-link>
            <font-awesome-icon icon="sign-out-alt" class="cursor-pointer" @click="logout" />
        </div>
    </div>
</template>

<script>
    import UserAvatar from '@/components/User/UserAvatar.vue'
    export default {
        components: { UserAvatar },
        props: {
            username: {
                type: String,
                default: '',
            },
            email: {
                type: String,
                default: '',
            },
            avatar: {
                type: String,
                default: '',
            },
            status: {
                type: String,
                default: '#44ef44',
            },
        },
        methods: {
            logout() {
                this.$emitter.emit('logout')
            },
        },
    }
</script>
