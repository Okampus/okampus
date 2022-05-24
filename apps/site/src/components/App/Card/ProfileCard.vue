<template>
    <div class="flex p-4 xs:rounded-xl bg-content">
        <div class="my-auto min-w-fit">
            <ProfileAvatar :avatar="user.avatar" :name="user.fullname" />
        </div>
        <div class="flex flex-col justify-between ml-4">
            <div>
                <div class="flex gap-2 text-lg text-0">
                    <div class="my-auto font-bold">{{ user.firstname }} {{ user.lastname }}</div>
                    <LabelTag
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
                    :to="`/user/${user.userId}`"
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
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import schoolRolesEnum, { DEFAULT_ROLE } from '@/shared/types/school-roles.enum'
    import LabelTag from '@/components/UI/Label/LabelTag.vue'

    export default {
        components: { ProfileAvatar, LabelTag },
        props: {
            user: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {
                schoolRoleItem: schoolRolesEnum.find(
                    (role) => role.key === (this.user.schoolRole || DEFAULT_ROLE),
                ),
            }
        },
    }
</script>
