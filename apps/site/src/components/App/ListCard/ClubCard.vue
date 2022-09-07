<template>
    <div class="card-hover bg-2 relative flex max-w-[30rem] flex-col rounded-lg pb-4 shadow-md">
        <ProfileBanner
            class="h-20 w-full rounded-t-lg"
            :banner="club.banner"
            :name="club.name"
            :data="club.category"
        />
        <div class="mx-3 flex h-full flex-col items-center md:mx-5">
            <div class="flex w-full justify-between">
                <div class="flex flex-wrap items-start gap-x-2 pt-2">
                    <div class="bg-2 z-10 -mt-6 rounded-2xl p-1">
                        <ProfileAvatar
                            :rounded-full="false"
                            :avatar="club.avatar"
                            :size="3.5"
                            :name="club.name"
                        />
                    </div>
                    <router-link
                        v-for="label in club.labels.filter((label) => label.type === 'Category')"
                        :key="label.id"
                        class="z-10 mt-1"
                        :to="`/clubs/${clubTypes?.[label.name]?.link ?? label.name}`"
                        @mouseover="showLink = false"
                        @mouseleave="showLink = true"
                    >
                        <LabelSimple
                            class="bg-slate-600/40 py-0 px-1 text-[0.7rem] font-medium tracking-tighter hover:bg-slate-400/40"
                            >{{ label.name }}</LabelSimple
                        >
                    </router-link>
                </div>
                <ModalDropdown :buttons="buttons">
                    <i
                        class="fa fa-ellipsis text-2 cursor-pointer self-center px-3 pt-2 pb-1 text-xl md:-mr-1"
                        @mouseover="showLink = false"
                        @mouseleave="showLink = true"
                    />
                </ModalDropdown>
            </div>

            <div class="flex h-full w-full flex-col justify-between">
                <router-link
                    class="text-1 mt-2 text-xl font-bold line-clamp-1"
                    :class="showLink && clickable ? 'card-link' : 'pointer-events-none'"
                    :to="`/club/${club.id}`"
                >
                    {{ club.name }}
                </router-link>

                <div class="text-2 mt-1 text-sm">
                    {{ club.shortDescription }}
                </div>

                <div class="mt-3 flex h-12 w-full flex-row items-center justify-between">
                    <div class="z-10 -ml-1" @mouseover="showLink = false" @mouseleave="showLink = true">
                        <button
                            v-if="
                                club.userMembership.membership?.role &&
                                specialRoles.includes(club.userMembership.membership?.role)
                            "
                            class="button-green pill-button"
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
                            class="button-grey pill-button"
                            @click="router.push(`/me/clubs/requests`)"
                        >
                            <i class="fa fa-envelope" />
                            <div>En attenteNe plus suivre</div>
                        </button>
                        <button
                            v-else-if="[LIKE, SUPERLIKE].includes(club.userInterest?.state)"
                            class="button-red -ml-1 rounded-full py-1 text-center font-semibold"
                            @click="
                                () =>
                                    updateInterestMutation({
                                        id: club.userInterest.id,
                                        updateInterest: {
                                            state: NOPE,
                                        },
                                    })
                            "
                        >
                            Ne plus suivre
                        </button>
                        <button
                            v-else
                            class="button-green -ml-1 rounded-full py-1 text-center font-semibold"
                            @click="
                                () => {
                                    if (!club.userInterest) {
                                        createInterestMutation({
                                            createInterest: {
                                                userId: localStore.me.id,
                                                teamId: club.id,
                                                state: LIKE,
                                            },
                                        })
                                    } else {
                                        updateInterestMutation({
                                            id: club.userInterest.id,
                                            updateInterest: { state: LIKE },
                                        })
                                    }
                                }
                            "
                        >
                            + Suivre
                        </button>
                        <!-- <button
                            v-else
                            class="button-blue -ml-1 rounded-full py-1 text-center font-semibold"
                            @click="emit('join')"
                        >
                            Rejoindre
                        </button> -->
                    </div>

                    <AvatarGroup
                        :link="`/club/${club.id}/members`"
                        :total-count="club.activeMemberCount"
                        :entities="
                            club.boardMembers.map((membership) => ({
                                ...membership.user,
                                text: `${clubRoleNames[membership.role][locale]} de ${club.name}`,
                            }))
                        "
                        @mouseover="showLink = false"
                        @mouseleave="showLink = true"
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
    import { showErrorToast, showInfoToast, showSuccessToast, showToastGraphQLError } from '@/utils/toast.js'

    import { useI18n } from 'vue-i18n'
    import { ref } from 'vue'

    import { LIKE, SUPERLIKE, NOPE } from '@/shared/types/interest-states.enum'
    import { useMutation } from '@vue/apollo-composable'
    import { createInterest } from '@/graphql/queries/teams/createInterest'
    import { updateInterest } from '@/graphql/queries/teams/updateInterest'

    import localStore from '@/store/local.store'

    const { locale } = useI18n({ useScope: 'global' })

    const router = useRouter()

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
        clickable: {
            type: Boolean,
            default: true,
        },
    })

    const {
        mutate: createInterestMutation,
        onError: onErrorCreate,
        onDone: onDoneCreate,
    } = useMutation(createInterest)
    onErrorCreate(showToastGraphQLError)

    const {
        mutate: updateInterestMutation,
        onError: onErrorUpdate,
        onDone: onDoneUpdate,
    } = useMutation(updateInterest)
    onErrorUpdate(showToastGraphQLError)

    onDoneCreate(({ data }) => {
        const name = data.createInterest.team.name
        showSuccessToast(`Vous êtes maintenant intéressé(e) par ${name} 🙌`)
        // clubs.value.find((club) => club.name === name).userInterest = data.createInterest
    })

    onDoneUpdate(({ data }) => {
        const newState = data.updateInterest.state
        const name = data.updateInterest.team.name
        if ([LIKE, SUPERLIKE].includes(newState)) {
            showSuccessToast(`Vous êtes maintenant intéressé(e) par ${name} 🙌`)
        } else {
            showSuccessToast(`Vous n'êtes plus intéressé(e) par ${name} 🙅`)
        }

        // clubs.value.find((club) => club.name === name).userInterest = data.updateInterest
    })

    // const emit = defineEmits(['join'])

    const showLink = ref(true)
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
