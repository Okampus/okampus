<template>
    <div class="flex p-4 xs:rounded-xl bg-content">
        <div class="my-auto min-w-fit">
            <UserAvatar :img-src="user.avatar" :username="fullname" />
        </div>
        <div class="flex flex-col justify-between ml-4">
            <div>
                <div class="flex gap-2 text-lg text-0">
                    <div class="my-auto font-bold">{{ fullname }}</div>
                    <AppTag
                        :tag-name="roleItem[$i18n.locale]"
                        :tag-color="roleItem.color"
                        :icon="roleItem.icon"
                    />
                </div>
                <div class="mb-2 line-clamp-2">
                    {{ user.description }}
                </div>
                <router-link
                    class="flex gap-1 my-auto ml-1 text-blue-500 hover:underline"
                    :to="`/users/${user.userId}`"
                >
                    <i class="fas fa-external-link-alt" />
                    <div>Voir le profil</div>
                </router-link>
            </div>
            <div class="flex gap-4 mt-2 text-sm text-5">
                <div class="flex gap-2">
                    <i class="fas fa-trophy" />
                    <div>{{ user.points }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import UserAvatar from '@/components/User/UserAvatar.vue'
    import rolesEnum from '@/shared/types/school-roles.enum'
    import AppTag from '../AppTag.vue'

    const props = defineProps({
        user: {
            type: Object,
            required: true,
        },
    })

    const fullname = props.user.firstname + ' ' + props.user.lastname
    const roleItem = rolesEnum.find((role) => role.key === props.user.schoolRole)
</script>
