<template>
    <div
        class="flex gap-4 items-start w-full min-w-[12rem] max-w-[30rem] xs:w-[calc(50%-0.7rem)] xl:w-[calc(33%-0.7rem)] card-2 card-hover"
    >
        <div class="flex flex-col shrink-0 gap-3 items-center">
            <ProfileAvatar :size="4" class="px-2 min-w-fit" :avatar="user.avatar" :name="fullname(user)" />

            <TipPopper :tip="`${user.points} points`">
                <div class="inline-flex flex-nowrap gap-2 ml-1 w-fit text-5 align-items">
                    <div class="text-xl">🏆</div>
                    <div class="font-semibold text-1">{{ user.points }}</div>
                </div>
            </TipPopper>
        </div>
        <div class="flex flex-col gap-3">
            <div class="inline-flex flex-wrap gap-x-6 text-lg text-0 align-items">
                <router-link
                    :to="`/user/${user.userId}`"
                    class="inline my-auto font-semibold hover:underline"
                    >{{ fullname(user) }}</router-link
                >

                <LabelTag
                    class="inline text-sm"
                    :tag-name="role[$i18n.locale]"
                    :tag-color="role.color"
                    :icon="role.icon"
                />
            </div>

            <div class="line-clamp-2 text-1">
                {{ user.shortDescription }}
            </div>

            <div class="flex flex-wrap gap-1 items-center">
                <template v-for="club in user.clubs?.slice(0, 4)" :key="club">
                    <router-link :to="`/club/${club.team.teamId}`">
                        <ProfileAvatar
                            :avatar="club.team.avatar"
                            :name="club.team.name"
                            size="3"
                            :class="
                                specialRoles.find((role) => role === club.role)
                                    ? 'border-2 border-yellow-300 rounded-full'
                                    : ''
                            "
                        />
                    </router-link>
                </template>

                <router-link :to="`/user/${user.userId}`" class="ml-2">
                    <i
                        v-if="user.clubs?.length > 4"
                        class="flex justify-center items-center w-8 h-8 text-xl text-white rounded-full fas fa-plus button-blue"
                    />
                </router-link>
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
