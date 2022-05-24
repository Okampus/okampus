<template>
    <div
        class="flex flex-col pb-4 w-full min-w-[15rem] rounded-lg shadow-xl sm:w-[calc(50%-1.5rem)] xl:w-[calc(33%-1.5rem)] bg-2"
    >
        <ProfileBanner
            class="w-full h-20 rounded-t-lg"
            :img-src="club.banner"
            :name="club.name"
            :data="club.category"
        />
        <div class="flex flex-col items-start mx-3 h-full md:mx-5">
            <div class="flex justify-between w-full">
                <div class="flex gap-3 items-start pt-2">
                    <div class="p-1 -mt-10 rounded-2xl bg-2">
                        <ProfileAvatar
                            :rounded-full="false"
                            :img-src="club.avatar"
                            :size="4.5"
                            :username="club.name"
                        />
                    </div>
                    <router-link class="mt-2" :to="`/clubs/${clubTypes[club.category].link}`">
                        <LabelSimple class="line-clamp-1">{{ club.category }}</LabelSimple>
                    </router-link>
                </div>
                <ModalDropdown :buttons="buttons">
                    <i class="self-center mt-1 ml-3 text-xl cursor-pointer md:-mr-1 fa fa-ellipsis text-2" />
                </ModalDropdown>
            </div>

            <div class="flex flex-col justify-between w-full h-full">
                <router-link class="mt-2" :to="`/club/${club.teamId}`">
                    <h3 class="text-xl font-bold hover:underline line-clamp-1 text-1">
                        {{ club.name }}
                    </h3>
                    <div class="mt-1 text-sm text-2">
                        {{ club.description }}
                    </div>
                </router-link>
                <div class="flex flex-row justify-between items-center mt-3 w-full h-12">
                    <button
                        class="py-1.5 px-4 -ml-1 w-fit font-semibold text-center text-white bg-blue-600 rounded-full"
                        @click="() => joinClub(club.teamId)"
                    >
                        Rejoindre
                    </button>
                    <div class="flex flex-row-reverse gap-1 ml-4 text-0">
                        <div v-for="(specialMember, i) in specialMembers" :key="i" class="-ml-3">
                            <TipPopper
                                placement="top"
                                offset="7"
                                class="z-100"
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
                                <div class="pt-2 h-16 avatar-hover">
                                    <template v-if="isMobile">
                                        <ProfileAvatar
                                            class="relative border-2 border-2-light dark:border-2-dark !shadow-none"
                                            :class="specialMembersActive[i] ? 'hovered' : ''"
                                            :size="3"
                                            :img-src="specialMember.member.avatar"
                                            :username="fullname(specialMember.member)"
                                        />
                                    </template>
                                    <template v-else>
                                        <router-link :to="`/user/${specialMember.member.userId}`">
                                            <ProfileAvatar
                                                class="relative border-2 border-2-light dark:border-2-dark !shadow-none cursor-pointer hovered"
                                                :size="3"
                                                :img-src="specialMember.member.avatar"
                                                :username="fullname(specialMember.member)"
                                            />
                                        </router-link>
                                    </template>
                                </div>
                            </TipPopper>
                        </div>
                    </div>
                    <span v-if="props.club.memberCount > specialMembers.length" class="text-0"
                        >+ {{ abbrNumbers(props.club.memberCount - specialMembers.length) }}</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { fullname } from '@/utils/users'
    import { abbrNumbers } from '@/utils/abbrNumbers'
    import { clubRoleNames } from '@/shared/types/club-roles.enum'
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

    const joinClub = (club) => {
        console.log('joinClub', club)
    }

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const specialMembers = [
        { role: 'owner', member: props.club.owner },
        { role: 'treasurer', member: props.club.treasurer },
        { role: 'secretary', member: props.club.secretary },
    ].filter((specialMember) => !!specialMember.member)

    const specialMembersActive = ref(specialMembers.map(() => false))

    const router = useRouter()
    const buttons = [
        {
            name: 'Lien',
            icon: 'fas fa-link',
            class: 'hover:bg-blue-500',
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
            class: 'hover:bg-gray-500',
            action: () => {
                router.push(`/clubs/${props.club.teamId}`)
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
            @apply -mt-3;

            z-index: 100;
        }
    }
</style>
