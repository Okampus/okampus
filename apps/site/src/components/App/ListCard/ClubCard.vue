<template>
    <div
        class="card-hover bg-2 relative flex w-full min-w-[12rem] max-w-[30rem] flex-col rounded-lg pb-4 shadow-md xs:w-[calc(50%-0.7rem)] xl:w-[calc(33%-0.7rem)]"
    >
        <ProfileBanner
            class="h-20 w-full rounded-t-lg"
            :banner="club.banner"
            :name="club.name"
            :data="club.category"
        />
        <div class="mx-3 flex h-full flex-col items-center md:mx-5">
            <div class="flex w-full justify-between">
                <div class="flex items-start gap-3 pt-2">
                    <div class="bg-2 z-10 -mt-10 rounded-2xl p-1">
                        <ProfileAvatar
                            :rounded-full="false"
                            :avatar="club.avatar"
                            :size="4.5"
                            :name="club.name"
                        />
                    </div>
                    <router-link class="mt-2" :to="`/clubs/${clubTypes[club.category].link}`">
                        <LabelSimple class="bg-slate-600/40 text-xs hover:bg-slate-400/40">{{
                            club.category
                        }}</LabelSimple>
                    </router-link>
                </div>
                <ModalDropdown :buttons="buttons">
                    <i
                        class="fa fa-ellipsis text-2 cursor-pointer self-center px-3 pt-2 pb-1 text-xl md:-mr-1"
                    />
                </ModalDropdown>
            </div>

            <div class="flex h-full w-full flex-col justify-between">
                <router-link class="mt-2" :to="`/club/${club.id}`">
                    <h3 class="text-1 text-xl font-bold line-clamp-1 hover:underline">
                        {{ club.name }}
                    </h3>
                    <div class="text-2 mt-1 text-sm">
                        {{ club.shortDescription }}
                    </div>
                </router-link>

                <div class="mt-3 flex h-12 w-full flex-row items-center justify-between">
                    <button
                        v-if="
                            club.userMembership.membership?.role &&
                            specialRoles.includes(club.userMembership.membership?.role)
                        "
                        class="button-green pill-button -ml-1"
                        @click="router.push(`/club/${club.id}/manage`)"
                    >
                        <i class="fa fa-gear" />
                        <div>Gérer</div>
                    </button>
                    <button
                        v-else-if="club.userMembership.membership?.role"
                        class="button-indigo pill-button -ml-1"
                        @click="router.push(`/club/${club.id}`)"
                    >
                        <i class="fa fa-users" />
                        <div>Profil</div>
                    </button>
                    <button
                        v-else-if="club.userMembership.pendingRequest"
                        class="button-grey pill-button -ml-1"
                        @click="router.push(`/me/clubs/requests`)"
                    >
                        <i class="fa fa-envelope" />
                        <div>En attente</div>
                    </button>
                    <button
                        v-else
                        class="button-blue -ml-1 rounded-full py-1 text-center font-semibold"
                        @click="emit('join')"
                    >
                        Rejoindre
                    </button>

                    <AvatarGroup
                        :link="`/club/${club.id}/members`"
                        :total-user-count="club.activeMemberCount"
                        :users="
                            club.boardMembers.map((membership) => ({
                                ...membership.user,
                                title: `${clubRoleNames[membership.role][locale]} de ${club.name}`,
                            }))
                        "
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ModalDropdown from '@/components/UI/Modal/ModalDropdown.vue'

    import AvatarGroup from '@/components/List/AvatarGroup.vue'

    import { clubRoleNames, specialRoles } from '@/shared/types/club-roles.enum'
    import { clubTypes } from '@/shared/types/club-types.enum'

    import { getURL } from '@/utils/routeUtils'

    import { useRouter } from 'vue-router'
    import { showErrorToast, showInfoToast } from '@/utils/toast.js'

    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n({ useScope: 'global' })

    const router = useRouter()

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const emit = defineEmits(['join'])

    const buttons = [
        {
            name: 'Lien',
            icon: 'fas fa-link',
            class: 'hover:bg-blue-300 dark:hover:bg-blue-500',
            action: async () => {
                try {
                    await navigator.clipboard.writeText(getURL(`/club/${props.club.id}`))
                    showInfoToast(`Lien de ${props.club.name} copié.`)
                } catch (err) {
                    showErrorToast(`[Erreur] Le lien de ${props.club.name} n'a pas pu être copié.`)
                }
            },
        },
        {
            name: 'Profil',
            icon: 'fas fa-address-book',
            class: 'hover:bg-gray-300 dark:hover:bg-gray-500',
            action: () => {
                router.push(`/club/${props.club.id}`)
            },
        },
    ]
</script>

<style lang="scss">
    .avatar-hover {
        & * {
            transition: margin-top 0.2s ease-in-out;
        }

        &:hover .hovered {
            transition: margin-top 0.2s ease-in-out 200ms;
            @apply -mt-1;
        }
    }
</style>
