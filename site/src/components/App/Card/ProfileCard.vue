<template>
    <div class="flex card h-34">
        <div class="my-auto min-w-fit">
            <AvatarImage
                :size="24"
                :src="user.avatar"
                alt="alt"
            />
        </div>
        <div class="ml-4 flex flex-col justify-between">
            <div>
                <div class="text-lg flex gap-2 text-0">
                    <div class="my-auto font-bold">
                        {{ user.username }} {{ user.username.toUpperCase() }}
                    </div>
                    <div class="text-5 my-auto text-sm ">
                        L2-F
                    </div>
                    <router-link
                        class="text-blue-500 hover:underline flex my-auto gap-1 ml-1"
                        :to="`/users/${user.userId}`"
                    >
                        <font-awesome-icon
                            icon="external-link-alt"
                        />
                        <div>Voir le profil</div>
                    </router-link>
                </div>
                <div class="line-clamp-2">
                    {{ user.description }}
                </div>
            </div>
            <div class="text-5 gap-4 flex text-sm mt-2">
                <div class="flex gap-2">
                    <font-awesome-icon
                        icon="file-upload"
                    />
                    <div>105</div>
                </div>
                <div class="flex gap-2">
                    <font-awesome-icon
                        icon="pen-alt"
                    />
                    <div>25</div>
                </div>
                <div class="flex gap-2">
                    <font-awesome-icon
                        icon="question-circle"
                    />
                    <div>2</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AvatarImage from "@/components/User/UserAvatar.vue";
export default {
    components: { AvatarImage },
    props : {
        user: {
            type: Object,
            default: () => {}
        }
    }
}
</script>
<style lang="">

</style>
