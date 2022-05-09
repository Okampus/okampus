<template>
    <div class="flex p-4 xs:rounded-xl bg-content">
        <div class="my-auto min-w-fit">
            <UserAvatar :img-src="user.avatar" :username="user.fullname" />
        </div>
        <div class="flex flex-col justify-between ml-4">
            <div>
                <div class="flex gap-2 text-lg text-0">
                    <div class="my-auto font-bold">{{ user.firstname }} {{ user.lastname }}</div>
                    <AppTag
                        :tag-name="schoolRoleItem[$i18n.locale]"
                        :tag-color="schoolRoleItem.color"
                        :icon="schoolRoleItem.icon"
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

<script>
    import UserAvatar from '@/components/User/UserAvatar.vue'
    import schoolRolesEnum from '@/shared/types/school-roles.enum'
    import AppTag from '../AppTag.vue'

    export default {
        components: { UserAvatar, AppTag },
        props: {
            user: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {
                schoolRoleItem: schoolRolesEnum.find(
                    (role) => role.key === (this.user.schoolRole || 'horizon'),
                ),
            }
        },
    }
</script>
