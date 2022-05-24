<template>
    <div class="flex gap-4 p-4 mx-4 xs:rounded-xl bg-content">
        <ProfileAvatar :size="4" class="px-2 my-auto min-w-fit" :img-src="user.avatar" :username="fullname" />
        <div class="flex flex-col gap-1.5 ml-4">
            <div class="flex gap-3 text-lg text-0 align-items">
                <div class="my-auto font-bold">{{ fullname }}</div>
                <LabelTag
                    class="text-sm"
                    :tag-name="roleItem[$i18n.locale]"
                    :tag-color="roleItem.color"
                    :icon="roleItem.icon"
                />
                <TipPopper :tip="`${user.points} points`">
                    <div class="flex gap-2 w-fit text-5 align-items">
                        <i class="pt-1 fas fa-trophy" />
                        <div>{{ user.points }}</div>
                    </div>
                </TipPopper>
            </div>
            <div class="line-clamp-2">
                {{ user.description }}
            </div>
            <router-link class="text-blue-500 hover:underline" :to="`/user/${user.userId}`">
                <div class="flex gap-2 text-lg">
                    <i class="pt-1 fas fa-external-link-alt" />
                    <div>Voir le profil</div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
    import LabelTag from '@/components/UI/Label/LabelTag.vue'
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import rolesEnum from '@/shared/types/school-roles.enum'

    const props = defineProps({
        user: {
            type: Object,
            required: true,
        },
    })

    const fullname = props.user.firstname.split(' ')[0] + ' ' + props.user.lastname
    const roleItem = rolesEnum.find((role) => role.key === props.user.schoolRole)
</script>
