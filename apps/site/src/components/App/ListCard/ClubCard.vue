<template>
    <div
        class="flex relative flex-col pb-4 w-full min-w-[13rem] max-w-[30rem] rounded-lg shadow-md sm:w-[calc(50%-1.5rem)] xl:w-[calc(33%-1.5rem)] card-hover bg-2"
    >
        <ProfileBanner
            class="w-full h-20 rounded-t-lg"
            :banner="club.banner"
            :name="club.name"
            :data="club.category"
        />
        <div class="flex flex-col items-start mx-3 h-full md:mx-5">
            <div class="flex justify-between w-full">
                <div class="flex gap-3 items-start pt-2">
                    <div class="z-10 p-1 -mt-10 rounded-2xl bg-2">
                        <ProfileAvatar
                            :rounded-full="false"
                            :avatar="club.avatar"
                            :size="4.5"
                            :name="club.name"
                        />
                    </div>
                    <router-link class="mt-2" :to="`/clubs/${clubTypes[club.category].link}`">
                        <LabelSimple class="text-xs bg-slate-600/40 hover:bg-slate-400/40">{{
                            club.category
                        }}</LabelSimple>
                    </router-link>
                </div>
                <ModalDropdown :buttons="buttons">
                    <i
                        class="self-center px-3 pt-2 pb-1 text-xl cursor-pointer md:-mr-1 fa fa-ellipsis text-2"
                    />
                </ModalDropdown>
            </div>

            <div class="flex flex-col justify-between w-full h-full">
                <router-link class="mt-2" :to="`/club/${club.teamId}`">
                    <h3 class="text-xl font-bold hover:underline line-clamp-1 text-1">
                        {{ club.name }}
                    </h3>
                    <div class="mt-1 text-sm text-2">
                        {{ club.shortDescription }}
                    </div>
                </router-link>

                <div class="flex flex-row justify-between items-center mt-3 w-full h-12">
                    <button
                        v-if="!club.membership"
                        class="py-1 px-3 -ml-1 w-fit font-semibold text-center text-white bg-blue-600 hover:bg-blue-700 rounded-full"
                        @click="emit('request', club.teamId)"
                    >
                        Rejoindre
                    </button>
                    <template v-else-if="club.membership === IS_WAITING">
                        <router-link
                            :to="`/me/clubs/requests`"
                            class="flex gap-2 items-center py-1 px-3 -ml-1 w-fit font-semibold text-center text-white bg-gray-400/60 hover:bg-gray-500/60 rounded-full"
                        >
                            <i class="fa fa-envelope" />
                            <div>En attente</div>
                        </router-link>
                    </template>
                    <template v-else-if="club.membership === IS_MEMBER">
                        <router-link
                            :to="`/club/${club.teamId}`"
                            class="flex gap-2 items-center py-1 px-3 -ml-1 w-fit font-semibold text-center text-white bg-indigo-500 hover:bg-indigo-600 rounded-full"
                        >
                            <i class="fa fa-users" />
                            <div>Profil</div>
                        </router-link>
                    </template>
                    <template v-else-if="club.membership === IS_SPECIAL_ROLE">
                        <router-link
                            :to="`/club/${club.teamId}/manage`"
                            class="flex gap-2 items-center py-1 px-3 -ml-1 w-fit font-semibold text-center text-white bg-green-500 hover:bg-green-600 rounded-full"
                        >
                            <i class="fa fa-gear" />
                            <div>Gérer</div>
                        </router-link>
                    </template>

                    <div class="flex flex-row-reverse gap-1 ml-4 text-0">
                        <span v-if="props.club.memberCount > specialMembers.length" class="my-auto text-0"
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
                                <div class="h-12 rounded-full avatar-hover">
                                    <template v-if="isMobile">
                                        <ProfileAvatar
                                            class="relative p-1 rounded-full !shadow-none bg-2"
                                            :class="specialMembersActive[i] ? 'hovered' : ''"
                                            :size="2.5"
                                            :avatar="specialMember.member.avatar"
                                            :name="fullname(specialMember.member)"
                                        />
                                    </template>
                                    <template v-else>
                                        <router-link :to="`/user/${specialMember.member.userId}`">
                                            <ProfileAvatar
                                                class="relative p-1 rounded-full !shadow-none cursor-pointer hovered bg-2"
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
