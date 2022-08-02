<template>
    <div
        class="card-2 card-hover flex w-full min-w-[12rem] max-w-[30rem] items-start gap-4 xs:w-[calc(50%-0.7rem)] xl:w-[calc(33%-0.7rem)]"
    >
        <div class="flex shrink-0 flex-col items-center gap-3">
            <ProfileAvatar :size="4" class="min-w-fit" :avatar="user.avatar" :name="fullname(user)" />

            <TipPopper :tip="`${user.points} points`">
                <div class="text-5 align-items ml-1 inline-flex w-fit flex-nowrap gap-2">
                    <div class="text-xl">🏆</div>
                    <div class="text-1 font-semibold">{{ user.points }}</div>
                </div>
            </TipPopper>
        </div>
        <div class="flex flex-col gap-3">
            <div class="text-0 align-items inline-flex flex-wrap gap-x-6 text-lg">
                <router-link :to="`/user/${user.id}`" class="my-auto inline font-semibold hover:underline">{{
                    fullname(user)
                }}</router-link>

                <LabelTag
                    class="inline text-sm"
                    :tag-name="role[locale]"
                    :tag-color="role.color"
                    :icon="role.icon"
                />
            </div>

            <div class="text-1 line-clamp-2">
                {{ user.shortDescription }}
            </div>

            <div class="flex flex-wrap items-center gap-1">
                <template v-for="club in user.clubs?.slice(0, 4)" :key="club">
                    <router-link :to="`/club/${club.team.id}`">
                        <ProfileAvatar
                            :avatar="club.team.avatar"
                            :name="club.team.name"
                            :size="3"
                            :class="
                                specialRoles.find((role) => role === club.role)
                                    ? 'border-2 border-yellow-300 rounded-full'
                                    : ''
                            "
                        />
                    </router-link>
                </template>

                <router-link v-if="user.clubs?.length > 4" :to="`/user/${user.id}`" class="link-blue ml-2">
                    + {{ user.clubs.length - 4 }} assos
                    <!-- <i
                        v-if="user.clubs?.length > 4"
                        class="flex justify-center items-center w-8 h-8 text-xl text-white rounded-full fas fa-plus button-blue"
                    /> -->
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

    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n({ useScope: 'global' })

    const props = defineProps({
        user: {
            type: Object,
            required: true,
        },
    })

    const role = getRole(props.user)
</script>
