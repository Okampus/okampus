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
                <router-link class="mt-2" :to="`/club/${club.teamId}`">
                    <h3 class="text-1 text-xl font-bold line-clamp-1 hover:underline">
                        {{ club.name }}
                    </h3>
                    <div class="text-2 mt-1 text-sm">
                        {{ club.shortDescription }}
                    </div>
                </router-link>

                <div class="mt-3 flex h-12 w-full flex-row items-center justify-between">
                    <button
                        v-if="!club.membership"
                        class="button-blue -ml-1 rounded-full py-1 text-center font-semibold"
                        @click="emit('request', club.teamId)"
                    >
                        Rejoindre
                    </button>
                    <template v-else-if="club.membership === IS_WAITING">
                        <router-link
                            :to="`/me/clubs/requests`"
                            class="button-grey -ml-1 flex items-center gap-2 rounded-full py-1 font-semibold"
                        >
                            <i class="fa fa-envelope" />
                            <div>En attente</div>
                        </router-link>
                    </template>
                    <template v-else-if="club.membership === IS_MEMBER">
                        <router-link
                            :to="`/club/${club.teamId}`"
                            class="button-indigo -ml-1 flex items-center gap-2 rounded-full py-1 font-semibold"
                        >
                            <i class="fa fa-users" />
                            <div>Profil</div>
                        </router-link>
                    </template>
                    <template v-else-if="club.membership === IS_SPECIAL_ROLE">
                        <router-link
                            :to="`/club/${club.teamId}/manage`"
                            class="button-green -ml-1 flex items-center gap-2 rounded-full py-1 font-semibold"
                        >
                            <i class="fa fa-gear" />
                            <div>Gérer</div>
                        </router-link>
                    </template>

                    <div class="text-0 ml-4 flex flex-row-reverse gap-1">
                        <span v-if="props.club.memberCount > specialMembers.length" class="text-0 my-auto"
                            >+ {{ abbrNumbers(props.club.memberCount - specialMembers.length) }}</span
                        >
                        <div v-for="(specialMember, i) in specialMembers" :key="i" class="-ml-3">
                            <TipPopper
                                placement="top"
                                offset="12"
                                :delay="200"
                                @open="specialMembersActive[i] = true"
                                @close="specialMembersActive[i] = false"
                            >
                                <template #content>
                                    <UserAboutCard
                                        :user="specialMember.member"
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
                                                :class="specialMembersActive[i] ? 'hovered' : ''"
                                                :size="2.5"
                                                :avatar="specialMember.member.avatar"
                                                :name="fullname(specialMember.member)"
                                            />
                                        </div>
                                    </template>
                                    <template v-else>
                                        <router-link class="p-1" :to="`/user/${specialMember.member.id}`">
                                            <ProfileAvatar
                                                class="hovered bg-2 relative cursor-pointer rounded-full !shadow-none"
                                                :size="2.5"
                                                :avatar="specialMember.member.avatar"
                                                :name="fullname(specialMember.member)"
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
    import { fullname } from '@/utils/users'
    import { abbrNumbers } from '@/utils/abbrNumbers'
    import { clubRoleNames, IS_MEMBER, IS_SPECIAL_ROLE, IS_WAITING } from '@/shared/types/club-roles.enum'
    import { clubTypes } from '@/shared/types/club-types.enum'
    import { ref } from 'vue'
    import { getURL } from '@/utils/routeUtils'

    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import UserAboutCard from '@/components/User/UserAboutCard.vue'
    import ModalDropdown from '@/components/UI/Modal/ModalDropdown.vue'

    import { emitter } from '@/shared/modules/emitter'
    import { useRouter } from 'vue-router'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const emit = defineEmits(['request'])

    const specialMembers = [
        { role: 'treasurer', member: props.club.treasurer },
        { role: 'secretary', member: props.club.secretary },
        { role: 'owner', member: props.club.owner },
    ].filter((specialMember) => !!specialMember.member)

    const specialMembersActive = ref(specialMembers.map(() => false))

    const router = useRouter()
    const buttons = [
        {
            name: 'Lien',
            icon: 'fas fa-link',
            class: 'hover:bg-blue-300 dark:hover:bg-blue-500',
            action: async () => {
                try {
                    await navigator.clipboard.writeText(getURL(`/club/${props.club.teamId}`))
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
                router.push(`/club/${props.club.teamId}`)
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
