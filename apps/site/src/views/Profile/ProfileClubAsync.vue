<template>
    <div>
        <ClubJoinForm v-model:show="showJoinForm" :club="club" @submitted="setRequestWaiting" />
        <ProfileBanner
            :name="club.name"
            :banner="club.banner"
            :data="club.category"
            class="h-40 p-0"
            :rounded-top="false"
        />
        <div class="text-0 bg-2 flex flex-col gap-6 pt-4">
            <div class="centered-container-padded mb-0 flex items-start justify-between gap-4 py-0">
                <div class="-mt-[5rem] flex gap-4">
                    <ProfileAvatar
                        :avatar="club.avatar"
                        :size="9"
                        :name="club.name"
                        inner-class="border-4 border-white dark:border-black !sahdow-none"
                    />
                    <div class="mt-[5.1rem] flex flex-col">
                        <div class="flex items-center gap-3">
                            <p class="text-3xl font-semibold">{{ club.name }}</p>

                            <router-link :to="`/clubs/${clubTypes[club.category].link}`">
                                <LabelSimple class="bg-slate-600/40 hover:bg-slate-400/40">{{
                                    club.category
                                }}</LabelSimple>
                            </router-link>
                        </div>
                        <p class="text-2 text-lg">{{ club.shortDescription }}</p>
                    </div>
                </div>

                <button
                    v-if="!memberRole"
                    class="button-blue rounded-full py-1 text-lg font-semibold"
                    @click="showJoinForm = true"
                >
                    Rejoindre
                </button>

                <template v-else-if="memberRole === IS_WAITING">
                    <router-link
                        :to="`/me/clubs/requests`"
                        class="button-grey flex items-center gap-2 rounded-full py-1 text-lg font-semibold"
                    >
                        <i class="fa fa-envelope" />
                        <div>En attente</div>
                    </router-link>
                </template>

                <template v-else-if="memberRole === IS_SPECIAL_ROLE">
                    <router-link
                        :to="`/club/${club.teamId}/manage`"
                        class="button-green flex items-center gap-2 rounded-full py-1 text-lg font-semibold"
                    >
                        <i class="fa fa-gear" />
                        <div>Gérer</div>
                    </router-link>
                </template>
            </div>

            <div class="centered-container-padded py-0">
                <HorizontalTabs v-model="currentTab" :tabs="tabs" :route-base="clubRoute" route-name="club" />
            </div>
        </div>

        <div class="centered-container py-4">
            <Transition mode="out-in" name="switch-fade">
                <KeepAlive>
                    <Suspense timeout="0">
                        <component :is="currentComponent" :club="club" />
                        <template #fallback>
                            <AppLoader />
                        </template>
                    </Suspense>
                </KeepAlive>
            </Transition>
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
    import ClubDriveAsync from '@/components/Profile/Club/ClubDriveAsync.vue'
    import ClubActivityAsync from '@/components/Profile/Club/ClubActivityAsync.vue'
    import ClubMembersAsync from '@/components/Profile/Club/ClubMembersAsync.vue'

    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'
    import ClubJoinForm from '@/components/Club/ClubJoinForm.vue'

    import AppLoader from '@/components/App/AppLoader.vue'

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
    import { clubTypes } from '@/shared/types/club-types.enum'

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
            name: 'Documents légaux',
            icon: 'file-arrow-down',
        },
        {
            id: MEMBERS,
            name: 'Membres',
            icon: 'users',
        },
        {
            id: ACTIVITY,
            name: 'Évents',
            icon: 'calendar',
        },
    ]

    const DEFAULT_TAB = tabs[0]

    const components = {
        [HOME]: ClubHomepage,
        [DRIVE]: ClubDriveAsync,
        [MEMBERS]: ClubMembersAsync,
        [ACTIVITY]: ClubActivityAsync,
    }

    const currentComponent = computed(() => components[currentTab.value ?? DEFAULT_TAB.id])

    const auth = useAuthStore()

    const clubs = useClubsStore()
    const club = ref(null)

    const clubId = ref(route.params.clubId)

    const userMemberships = ref([])
    const userRequests = ref([])

    const showJoinForm = ref(false)

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

    const setRequestWaiting = () => {
        const request = userRequests.value.find((request) => request.team.teamId === clubId.value)
        if (request) {
            request.state = PENDING
        } else {
            userRequests.value.push({ team: { teamId: clubId.value }, state: PENDING })
        }
    }

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
