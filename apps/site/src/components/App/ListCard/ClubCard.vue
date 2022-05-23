<template>
    <div class="flex flex-col pb-4 w-[16rem] rounded-lg shadow-xl md:w-[21rem] bg-2">
        <AppBanner
            class="w-full h-20 rounded-t-lg"
            :img-src="club.banner"
            :name="club.name"
            :data="club.category"
        />
        <div class="flex flex-col items-start mx-5">
            <div class="flex justify-between w-full">
                <div class="flex gap-3 items-start pt-2">
                    <div class="p-1 -mt-10 rounded-2xl bg-2">
                        <UserAvatar
                            :rounded-full="false"
                            :img-src="club.avatar"
                            :size="4.5"
                            :username="club.name"
                        />
                    </div>
                    <AppLabel>{{ club.category }}</AppLabel>
                </div>

                <!-- TODO: buttons -->
            </div>
            <router-link class="mt-2" :to="`/clubs/${club.teamId}`">
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
                        <AppTip
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
                                <!-- <div class="flex flex-col items-center w-full">
                                    <div class="font-semibold">
                                        {{ clubRoleNames[specialMember.role][$i18n.locale] }}
                                    </div>
                                    <div>{{ fullname(specialMember.member) }}</div>
                                </div> -->
                            </template>
                            <div class="pt-2 h-16 avatar-hover">
                                <template v-if="isMobile">
                                    <UserAvatar
                                        class="relative border-2 border-2-light dark:border-2-dark !shadow-none"
                                        :class="specialMembersActive[i] ? 'hovered' : ''"
                                        :size="3"
                                        :img-src="specialMember.member.avatar"
                                        :username="fullname(specialMember.member)"
                                    />
                                </template>
                                <template v-else>
                                    <router-link :to="`/users/${specialMember.member.userId}`">
                                        <UserAvatar
                                            class="relative border-2 border-2-light dark:border-2-dark !shadow-none cursor-pointer hovered"
                                            :size="3"
                                            :img-src="specialMember.member.avatar"
                                            :username="fullname(specialMember.member)"
                                        />
                                    </router-link>
                                </template>
                            </div>
                        </AppTip>
                    </div>
                </div>

                <span v-if="props.club.memberCount > specialMembers.length" class="truncate"
                    >+ {{ props.club.memberCount - specialMembers.length }}</span
                >
                <!-- <AvatarGroup :users="members" /> -->
            </div>
        </div>
    </div>
</template>

<script setup>
    import { fullname } from '@/utils/users'
    import { clubRoleNames } from '@/shared/types/club-roles.enum'

    import AppBanner from '../AppBanner.vue'
    import UserAvatar from '@/components/User/UserAvatar.vue'
    import AppTip from '../AppTip.vue'
    import { ref } from 'vue'
    import UserAboutCard from '@/components/User/UserAboutCard.vue'
    import AppLabel from '../AppLabel.vue'

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
