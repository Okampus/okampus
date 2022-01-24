<template>
    <div class="flex card h-34">
        <div class="my-auto min-w-fit">
            <AvatarImage :size="24" :src="user.avatar" alt="alt" />
        </div>
        <div class="flex flex-col justify-between ml-4">
            <div>
                <div class="flex gap-2 text-lg text-0">
                    <div class="my-auto font-bold">{{ user.username }} {{ user.username.toUpperCase() }}</div>
                    <div class="my-auto text-sm text-5">L2-F</div>
                    <router-link
                        class="flex gap-1 my-auto ml-1 text-blue-500 hover:underline"
                        :to="`/users/${user.userId}`"
                    >
                        <font-awesome-icon icon="external-link-alt" />
                        <div>Voir le profil</div>
                    </router-link>
                </div>
                <div class="line-clamp-2">
                    {{ user.description }}
                </div>
            </div>
            <div class="flex gap-4 mt-2 text-sm text-5">
                <div class="flex gap-2">
                    <font-awesome-icon icon="file-upload" />
                    <div>105</div>
                </div>
                <div class="flex gap-2">
                    <font-awesome-icon icon="pen-alt" />
                    <div>25</div>
                </div>
                <div class="flex gap-2">
                    <font-awesome-icon icon="question-circle" />
                    <div>2</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AvatarImage from '@/components/User/UserAvatar.vue'
export default {
    components: { AvatarImage },
    props: {
        user: {
            type: Object,
            default: () => {},
        },
    },
}
</script>
