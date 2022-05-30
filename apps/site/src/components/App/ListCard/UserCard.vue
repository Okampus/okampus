<template>
    <div class="flex gap-4 p-4 mx-4 xs:rounded-xl bg-content">
        <ProfileAvatar
            :size="4"
            class="px-2 my-auto min-w-fit"
            :avatar="user.avatar"
            :name="fullname(user)"
        />
        <div class="flex flex-col gap-1.5">
            <div class="flex gap-3 text-lg text-0 align-items">
                <router-link :to="`/user/${user.userId}`" class="my-auto font-semibold hover:underline">{{
                    fullname(user)
                }}</router-link>
                <LabelTag
                    class="text-sm"
                    :tag-name="role[$i18n.locale]"
                    :tag-color="role.color"
                    :icon="role.icon"
                />
                <TipPopper :tip="`${user.points} points`">
                    <div class="flex gap-2 w-fit text-5 align-items">
                        <i class="pt-1 fas fa-trophy" />
                        <div>{{ user.points }}</div>
                    </div>
                </TipPopper>
            </div>
            <div class="line-clamp-2 text-1">
                {{ user.shortDescription }}
            </div>
            <div class="flex flex-wrap gap-1">
                <ProfileAvatar
                    v-for="club in user.clubs"
                    :key="club"
                    :avatar="club.team.avatar"
                    :name="club.team.name"
                    size="2"
                    :class="
                        specialRoles.find((role) => role === club.role)
                            ? 'border-2 border-yellow-300 rounded-full'
                            : ''
                    "
                />
            </div>
        </div>
    </div>
</template>

<script setup>
    import LabelTag from '@/components/UI/Label/LabelTag.vue'
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { fullname, getRole } from '@/utils/users'
    import { specialRoles } from '@/shared/types/club-roles.enum'

    const props = defineProps({
        user: {
            type: Object,
            required: true,
        },
    })

    const role = getRole(props.user)
</script>
