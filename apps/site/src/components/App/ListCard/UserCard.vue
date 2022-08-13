<template>
    <div
        class="card-2 card-hover flex w-full min-w-[12rem] items-start gap-4 sm:w-[calc(50%-0.7rem)] xl:w-[calc(33%-0.7rem)]"
    >
        <div class="flex shrink-0 flex-col items-center gap-3">
            <ProfileAvatar :size="4" class="min-w-fit" :avatar="user.avatar" :name="fullname(user)" />

            <div
                v-tooltip="`${user.points} points`"
                class="text-5 align-items ml-1 inline-flex w-fit flex-nowrap gap-2"
            >
                <div class="text-xl">🏆</div>
                <div class="text-1 font-semibold">{{ user.points }}</div>
            </div>
        </div>
        <div class="flex flex-col">
            <div class="text-0 align-items inline-flex flex-wrap gap-2 text-lg">
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

            <AvatarGroup
                class="-ml-1.5 mt-1"
                :entities="
                    user?.clubs?.map((club) => ({
                        ...club.team,
                        title: club.role
                            ? `${clubRoleNames[capitalize(club.role)][locale]} de ${club.team.name}`
                            : '',
                    })) ?? []
                "
                :shown-count="4"
                :total-count="user?.clubs?.length ?? 0"
                :link="`/user/${user.id}`"
                entity-type="team"
            />
        </div>
    </div>
</template>

<script setup>
    import AvatarGroup from '@/components/List/AvatarGroup.vue'
    import LabelTag from '@/components/UI/Label/LabelTag.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { fullname, getRole } from '@/utils/users'

    import { useI18n } from 'vue-i18n'
    import { clubRoleNames } from '@/shared/types/club-roles.enum'

    import { capitalize } from 'lodash'

    const { locale } = useI18n({ useScope: 'global' })

    const props = defineProps({
        user: {
            type: Object,
            required: true,
        },
    })

    const role = getRole(props.user)
</script>
