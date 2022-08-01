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

                    <div class="text-0 ml-4 flex flex-row-reverse gap-1">
                        <span v-if="club.memberCount > club.boardMembers.length" class="text-0 my-auto"
                            >+ {{ abbrNumbers(club.memberCount - club.boardMembers.length) }}</span
                        >
                        <div v-for="(specialMember, i) in sortedBoardMembers" :key="i" class="-ml-3">
                            <TipPopper
                                placement="top"
                                offset="12"
                                :delay="200"
                                @open="hovering = i"
                                @close="hovering = null"
                            >
                                <template #content>
                                    <UserAboutCard
                                        :user="specialMember.user"
                                        :title="`${clubRoleNames[specialMember.role][$i18n.locale]} de ${
                                            club.name
                                        }`"
                                    />
                                </template>
                                <div class="avatar-hover h-12 rounded-full">
                                    <template v-if="isMobile">
                                        <div class="p-1">
                                            <ProfileAvatar
                                                class="bg-2 relative rounded-full p-1 !shadow-none"
                                                :class="{ 'hoverred': hovering === i }"
                                                :size="2.5"
                                                :avatar="specialMember.user.avatar"
                                                :name="fullname(specialMember.user)"
                                            />
                                        </div>
                                    </template>
                                    <template v-else>
                                        <router-link class="p-1" :to="`/user/${specialMember.user.id}`">
                                            <ProfileAvatar
                                                class="hovered bg-2 relative cursor-pointer rounded-full !shadow-none"
                                                :size="2.5"
                                                :avatar="specialMember.user.avatar"
                                                :name="fullname(specialMember.user)"
                                            />
                                        </router-link>
                                    </template>
                                </div>
                            </TipPopper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import UserAboutCard from '@/components/User/UserAboutCard.vue'
    import ModalDropdown from '@/components/UI/Modal/ModalDropdown.vue'

    import { fullname } from '@/utils/users'
    import { abbrNumbers } from '@/utils/abbrNumbers'
    import { clubRoleNames, specialRoles } from '@/shared/types/club-roles.enum'
    import { clubTypes } from '@/shared/types/club-types.enum'

    import { getURL } from '@/utils/routeUtils'
    import { computed, ref } from 'vue'

    import { emitter } from '@/shared/modules/emitter'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const emit = defineEmits(['join'])

    const sortedBoardMembers = computed(() =>
        [...(props.club.boardMembers ?? [])].sort(
            (member1, member2) => specialRoles.indexOf(member1.role) - specialRoles.indexOf(member2.role),
        ),
    )

    const hovering = ref(null)

    const buttons = [
        {
            name: 'Lien',
            icon: 'fas fa-link',
            class: 'hover:bg-blue-300 dark:hover:bg-blue-500',
            action: async () => {
                try {
                    await navigator.clipboard.writeText(getURL(`/club/${props.club.id}`))
                    emitter.emit('show-toast', {
                        message: `Lien de ${props.club.name} copié.`,
                        type: 'info',
                    })
                } catch (err) {
                    emitter.emit('show-toast', {
                        message: `Une erreur est survenue lors de la copie du lien de ${props.club.name}.`,
                        type: 'error',
                    })
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
