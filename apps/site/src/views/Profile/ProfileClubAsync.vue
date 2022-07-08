<template>
    <div>
        <ProfileBanner :name="club.name" :banner="club.banner" class="p-0 h-40" :rounded-top="false" />
        <div class="flex flex-col gap-6 pt-4 text-0 bg-2">
            <div class="flex gap-10 justify-between items-center centered-container">
                <div class="flex gap-4 -mt-[5rem]">
                    <ProfileAvatar
                        :avatar="club.avatar"
                        :size="9"
                        :name="club.name"
                        inner-class="border-4 border-white dark:border-black !sahdow-none"
                    />
                    <div class="flex flex-col mt-20">
                        <p class="text-3xl font-semibold">{{ club.name }}</p>
                        <p class="text-lg text-2">{{ club.shortDescription }}</p>
                    </div>
                </div>
                <button
                    v-if="!memberRole"
                    class="py-2 px-3 -ml-1 w-fit text-xl font-semibold text-center text-white bg-blue-600 hover:bg-blue-700 rounded-full"
                    @click="emit('request', club.teamId)"
                >
                    Rejoindre
                </button>
                <template v-else-if="memberRole === IS_WAITING">
                    <router-link
                        :to="`/me/clubs/requests`"
                        class="flex gap-2 items-center py-2 px-3 -ml-1 w-fit text-xl font-semibold text-center text-white bg-gray-400/60 hover:bg-gray-500/60 rounded-full"
                    >
                        <i class="fa fa-envelope" />
                        <div>En attente</div>
                    </router-link>
                </template>
                <template v-else-if="memberRole === IS_SPECIAL_ROLE">
                    <router-link
                        :to="`/club/${club.teamId}/manage`"
                        class="flex gap-2 items-center py-2 px-3 -ml-1 w-fit text-xl font-semibold text-center text-white bg-green-500 hover:bg-green-600 rounded-full"
                    >
                        <i class="fa fa-gear" />
                        <div>Gérer</div>
                    </router-link>
                </template>
            </div>
            <HorizontalTabs
                v-model="currentTab"
                class="centered-container"
                :tabs="tabs"
                :route-base="clubRoute"
                route-name="club"
            />
        </div>
        <div class="centered-container">
            <component :is="currentComponent" :club="club" />
        </div>
    </div>
    <!-- <div>
        <div class="p-0 pb-2 mx-auto mt-0 rounded-b-none text-1 card">
            <div class="">
                <div class="relative w-full h-48">
                    <div class="w-full h-full bg-blue-200" />
                    <div class="absolute -bottom-8 left-8">
                        <ProfileAvatar :avatar="club.avatar" :size="4.5" :name="club.name" />
                    </div>
                </div>
                <div class="px-4 pb-6 mt-8 w-full shadow-md">
                    <div class="flex flex-col pr-8 mb-4 space-y-4">
                        <div>
                            <div class="flex">
                                <div class="text-2xl font-bold">{{ club.name }}</div>
                                <div class="my-auto ml-2 text-gray-500">
                                    {{ club.category }}
                                </div>
                                <div class="my-auto ml-2 text-gray-500">
                                    {{ club.members.length }}
                                    <i class="fas fa-users"> </i>
                                </div>
                            </div>
                            <div>{{ club.description }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-4">
                <h1 class="mt-4 mb-2 text-xl">Le Bureau</h1>
                <div class="flex gap-4">
                    <div
                        class="flex flex-col flex-wrap justify-between items-center p-4 mb-4 w-48 h-48 rounded-lg shadow-md bg-2"
                    >
                        <ProfileAvatar
                            :avatar="club.members.find((member) => member.role === 'owner').avatar"
                            size="6"
                            :name="
                                club.members.find((member) => member.role === 'owner').user.firstname +
                                ' ' +
                                club.members.find((member) => member.role === 'owner').user.lastname
                            "
                        />
                        <div class="text-center">
                            <p class="leading-none line-clamp-2">
                                {{
                                    club.members.find((member) => member.role === 'owner').user.firstname +
                                    ' ' +
                                    club.members.find((member) => member.role === 'owner').user.lastname
                                }}
                            </p>
                            <p class="text-gray-400">Président</p>
                        </div>
                    </div>
                </div>
                <h1 class="mt-4 mb-2 text-xl">Les dernières activités</h1>
                <div class="flex gap-4"> -->
    <!-- <div
                        class="flex flex-col flex-wrap justify-between items-center p-4 mb-4 w-48 h-48 rounded-lg shadow-md bg-2"
                    >
                        <ProfileAvatar
                            :avatar="club.members.find((member) => member.role === 'owner').avatar"
                            size="6"
                            :name="
                                club.members.find((member) => member.role === 'owner').user.firstname +
                                ' ' +
                                club.members.find((member) => member.role === 'owner').user.lastname
                            "
                        />
                        <div class="text-center">
                            <p class="leading-none line-clamp-2">
                                {{
                                    club.members.find((member) => member.role === 'owner').user.firstname +
                                    ' ' +
                                    club.members.find((member) => member.role === 'owner').user.lastname
                                }}
                            </p>
                            <p class="text-gray-400">Président</p>
                        </div>
                    </div> -->
    <!-- </div>
            </div>
        </div> -->

    <!-- <div class="flex flex-col md:flex-row">
            <div class="order-2 mt-0 mb-4 space-y-4 md:order-1 md:mr-4 md:ml-2 md:w-1/2 lg:w-2/3">
                <div class="flex flex-col grow space-y-4 card">
                    <div class="text-xl">Activité</div>
                    <div v-if="activities">
                        <ThreadPreviewCard
                            v-for="activity in activities"
                            :key="activity.index"
                            :post="activity"
                        />
                    </div>
                    <div v-else class="">Pas d'activité pour cet utilisateur</div>
                </div>
            </div>
            <div class="flex flex-col order-1 mb-4 space-y-2 md:order-2 md:w-1/2 lg:w-1/3">
                <div class="card">
                    Comptes
                    <div class="flex flex-col mt-2 space-y-2">
                        <div v-if="user.email" class="flex space-x-2">
                            <i class="fas fa-enveloppe" />
                            <div>{{ user.email }}</div>
                        </div>
                        <div v-if="contacts === undefined || contacts === null">
                            Problème dans les comptes des réseaux sociaux
                        </div>
                        <div v-for="contact in contacts" v-else :key="contact">
                            <div class="flex space-x-2">
                                <i class="fas" :class="`fa-${contact.contact.icon}`" />
                                <a :href="contact.link">{{ contact.pseudo }}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
    <!-- </div> -->
</template>

<script setup>
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'

    import ClubHomepage from '@/components/Profile/Club/ClubHomepage.vue'
    import ManageDrive from '@/components/Profile/Manage/ManageDrive.vue'
    import ClubActivity from '@/components/Profile/Club/ClubActivity.vue'
    import ClubMembers from '@/components/Profile/Club/ClubMembers.vue'

    import { computed, ref, watchEffect } from 'vue'

    import { useRoute } from 'vue-router'

    import { useAuthStore } from '@/store/auth.store'
    import { useClubsStore } from '@/store/clubs.store'

    import { emitter } from '@/shared/modules/emitter'
    import { getStatusAxiosError } from '@/utils/errors'
    import { PENDING } from '@/shared/types/club-requests.enum'
    import { IS_MEMBER, IS_SPECIAL_ROLE, IS_WAITING, specialRoles } from '@/shared/types/club-roles.enum'
    import { errorCodes } from '@/shared/errors/app-exceptions.enum'
    import { isPositiveInteger } from '@/utils/stringUtils'

    const route = useRoute()

    const HOME = 'home'
    const MEMBERS = 'members'
    const DRIVE = 'drive'
    const ACTIVITY = 'activity'

    const clubRoute = computed(() => `/club/${route.params.clubId}`)

    const currentTab = ref(null)
    const tabs = [
        {
            id: HOME,
            name: 'Accueil',
            route: clubRoute,
            icon: 'house',
        },
        {
            id: DRIVE,
            name: 'Drive',
            icon: 'file-arrow-down',
        },
        {
            id: MEMBERS,
            name: 'Membres',
            icon: 'users',
        },
        {
            id: ACTIVITY,
            name: 'Activité',
            icon: 'history',
        },
    ]

    const DEFAULT_TAB = tabs[0]

    const components = {
        [HOME]: ClubHomepage,
        [DRIVE]: ManageDrive,
        [MEMBERS]: ClubMembers,
        [ACTIVITY]: ClubActivity,
    }

    const currentComponent = computed(() => components[currentTab.value ?? DEFAULT_TAB.id])

    const auth = useAuthStore()

    const clubs = useClubsStore()
    const club = ref(null)

    const clubId = ref(route.params.clubId)

    const userMemberships = ref([])
    const userRequests = ref([])

    const getRoleType = (role) => (specialRoles.includes(role) ? IS_SPECIAL_ROLE : role ? IS_MEMBER : null)

    const memberRole = computed(
        () =>
            getRoleType(userMemberships.value.find((member) => member.team.teamId === clubId.value)?.role) ??
            (userRequests.value.find(
                (request) => request.team.teamId === clubId.value && request.state === PENDING,
            )
                ? IS_WAITING
                : null),
    )

    const loadClub = async () => {
        await clubs
            .getClub(clubId.value)
            .then((clubData) => {
                club.value = clubData
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatusAxiosError(err) })
            })
    }

    await clubs.getMembershipsOf(auth.user).then((memberships) => {
        userMemberships.value = memberships
    })
    await clubs.getMembershipRequestsOf(auth.user).then((requests) => {
        userRequests.value = requests
    })
    await loadClub()

    watchEffect(async () => {
        if (route.name === 'club') {
            if (!isPositiveInteger(route.params.clubId)) {
                emitter.emit('error-route', { code: errorCodes.NOT_FOUND })
                return
            }

            clubId.value = parseInt(route.params.clubId)
            await loadClub()
        }
    })
</script>
