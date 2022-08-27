<template>
    <!-- TODO: Refactor all my-auto -->
    <GraphQLQuery
        :query="getUserRequests"
        :variables="{ id: auth.user.id }"
        :update="(data) => data?.userById"
    >
        <template #default="{ data: user }">
            <div>
                <HorizontalTabs
                    v-model="currentTab"
                    route-base="/me/clubs"
                    route-name="me"
                    :background-variant="2"
                    :tabs="tabs"
                    class="m-4"
                />
                <div class="text-0 divide-y divide-gray-500/40">
                    <template v-if="currentTab === MEMBER">
                        <template v-if="user.teamMemberships.length">
                            <div
                                v-for="membership in user.teamMemberships"
                                :key="membership.id"
                                class="flex items-center justify-between py-2"
                            >
                                <TeamActivity :team="membership.team">
                                    <template #subtitle>
                                        Votre rôle : <b>{{ clubRoleNames[membership.role][locale] }}</b>
                                    </template>
                                </TeamActivity>

                                <div class="flex gap-2">
                                    <template v-if="specialRoles.includes(membership.role)">
                                        <button class="button-red" @click="WIP(WIPText)">
                                            Passation de rôle
                                        </button>

                                        <router-link :to="`/club/${membership.team.id}/manage`">
                                            <button class="button-blue">Gérer</button>
                                        </router-link>
                                    </template>
                                    <template v-else>
                                        <button class="button-red" @click="WIP(WIPText)">Quitter</button>
                                        <router-link
                                            :to="`/club/${membership.team.id}`"
                                            class="button-blue text-xs md:text-lg"
                                            >Voir le profil</router-link
                                        >
                                    </template>
                                </div>
                            </div>
                        </template>
                        <div v-else class="my-6 flex flex-col items-center gap-4">
                            <img class="h-48 w-48" :src="BookmarkFav" />
                            <div class="text-2 text-lg">
                                Vous n'êtes actuellement membre d'aucune association.
                            </div>

                            <router-link to="/clubs">
                                <button class="button-blue mt-4 text-xl">
                                    Découvrir les associations<i class="fa fa-arrow-right ml-2" />
                                </button>
                            </router-link>
                        </div>
                    </template>

                    <template v-else-if="currentTab === REQUEST">
                        <template v-if="user.teamMembershipRequests.length">
                            <div
                                v-for="request in user.teamMembershipRequests"
                                :key="request.id"
                                class="flex items-center justify-between py-2"
                            >
                                <TeamActivity :team="request.team">
                                    <template #title>
                                        <div class="inline">
                                            {{ request.team.name }} • Rôle demandé :
                                            <b>{{ clubRoleNames[request.role][locale] }}</b>
                                        </div>
                                    </template>
                                    <template #subtitle>
                                        <div class="flex gap-1.5 text-sm">
                                            <div class="flex gap-1">
                                                <div class="text-4">Demandé</div>
                                                <TipRelativeDate :date="request.createdAt" />
                                            </div>
                                            <template v-if="request.state !== PENDING">
                                                <div>•</div>
                                                <div class="inline">
                                                    <div class="text-2">
                                                        {{ statusNames[request.state][locale] }}
                                                    </div>
                                                    <TipRelativeDate :date="request.handledAt" />
                                                    par {{ fullname(request.handledBy) }}
                                                </div>
                                            </template>
                                        </div>
                                    </template>
                                </TeamActivity>

                                <ClubFilledRequestForm
                                    v-model:show="showRequestModal"
                                    :request="shownRequest"
                                />

                                <div
                                    class="flex w-36 cursor-pointer items-center justify-center gap-2 rounded-xl py-1 px-3 text-white"
                                    :class="{
                                        'bg-green-500 hover:bg-green-600': request.state === APPROVED,
                                        'bg-red-500 hover:bg-red-600': request.state === REJECTED,
                                        'bg-gray-500/50 hover:bg-gray-600/50': request.state === PENDING,
                                    }"
                                    @click="
                                        () => {
                                            showRequestModal = true
                                            shownRequest = request
                                        }
                                    "
                                >
                                    <i class="fa" :class="statusNames[request.state].icon" />
                                    <div>{{ statusNames[request.state][locale] }}</div>
                                </div>
                            </div>
                        </template>

                        <div v-else class="my-6 flex flex-col items-center gap-4">
                            <img class="h-48 w-48" :src="BookmarkFav" />
                            <div class="text-2 text-lg">Vous n'avez pas de demandes d'adhésion en cours.</div>

                            <router-link to="/clubs">
                                <button class="button-blue mt-4 text-xl">
                                    Découvrir les associations<i class="fa fa-arrow-right ml-2" />
                                </button>
                            </router-link>
                        </div>
                    </template>
                </div>
                <!-- TODO: role transfer & management
                    <ModalPopup :show="showTransferModal" @close="showTransferModal = false">
                    <template #default="{ close }">
                        <div
                            v-if="currentMembership"
                            class="card flex flex-col items-center justify-center py-8 px-10"
                        >
                            <div class="text-2xl font-semibold">
                                Vous vous apprêtez à transmettre votre rôle de
                                {{ clubRoleNames[currentMembership.role][locale] }}
                            </div>
                            <div class="text-2 text-sm">
                                En transmettant votre rôle, vous le perdrez vous même.
                            </div>
                            <div
                                v-if="members.filter((memb) => !specialRoles.includes(memb.role)).length > 0"
                                class="mt-4 flex flex-col gap-4"
                            >
                                <div
                                    v-for="member of members.filter(
                                        (memb) => !specialRoles.includes(memb.role),
                                    )"
                                    :key="member"
                                    class="flex items-center gap-2"
                                >
                                    <ProfileAvatar
                                        :avatar="member.user.avatar"
                                        :name="fullname(member.user)"
                                        :size="2"
                                    />
                                    <p>{{ fullname(member.user) }}</p>
                                    <button class="button-blue" @click="() => transfer(member)">
                                        Transmettre le rôle
                                    </button>
                                </div>
                            </div>
                            <div v-else>
                                Il n'existe pas de membre auquel vous pouvez transmettre votre rôle
                            </div>
                            <div class="mt-6 flex gap-4 self-end">
                                <button class="button-grey" @click="close">Annuler</button>
                            </div>
                        </div>
                    </template>
                </ModalPopup> -->
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import TeamActivity from '@/components/App/General/TeamActivity.vue'

    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import ClubFilledRequestForm from '@/components/Club/ClubFilledRequestForm.vue'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    import BookmarkFav from '@/assets/img/3dicons/bookmark-fav.png'

    import { fullname } from '@/utils/users'

    import { clubRoleNames, specialRoles } from '@/shared/types/club-roles.enum'
    import { APPROVED, REJECTED, PENDING, statusNames } from '@/shared/types/club-requests.enum'

    // import { useClubsStore } from '@/store/clubs.store'
    import { useAuthStore } from '@/store/auth.store'
    import { getUserRequests } from '@/graphql/queries/users/getUserById'
    import { ref } from 'vue'

    import { WIP } from '@/utils/toast'

    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n({ useScope: 'global' })

    const auth = useAuthStore()
    const WIPText =
        '[Prévu pour Février 2023] Gestion des passations & des assemblées générales / Gestion des rôles avancée'
    // const clubs = useClubsStore()

    const showRequestModal = ref(false)
    const shownRequest = ref(null)

    // const members = ref([])
    // const showTransferModal = ref(false)

    const MEMBER = 'active'
    const REQUEST = 'requests'

    const tabs = [
        {
            id: MEMBER,
            name: 'Adhésions',
            route: '/me/clubs',
            icon: 'users',
        },
        {
            id: REQUEST,
            name: 'Demandes en cours',
            icon: 'envelope',
        },
    ]

    const currentTab = ref(null)

    // const currentMembership = ref(null)

    // const leaveClub = async (membership) => {
    //     clubs
    //         .removeMembership(membership.team.id, membership.user.id)
    //         .then(() => clubs.getMembershipsOf(auth.user))
    //         .catch((err) => {
    //             console.error(err)
    //         })
    // }

    // const transferRole = async (membership) => {
    //     currentMembership.value = membership
    //     clubs.getMembershipsOfClub(membership.team.id).then((memberships) => {
    //         members.value = memberships
    //         showTransferModal.value = true
    //     })
    // }

    // const transfer = (member) => {
    //     showTransferModal.value = false
    //     const role = currentMembership.value.role
    //     clubs
    //         .patchMembership(currentMembership.value.team.id, currentMembership.value.user.id, {
    //             role: 'member',
    //         })
    //         .then(() => {
    //             clubs.getMembershipsOf(auth.user).then((memberships) => {
    //                 members.value = memberships
    //             })
    //         })
    //     clubs
    //         .patchMembership(member.team.id, member.user.id, {
    //             role: role,
    //         })
    //         .then(() => {
    //             clubs.getMembershipsOf(auth.user).then((memberships) => {
    //                 members.value = memberships
    //             })
    //         })
    // }

    // await Promise.all([clubs.getMembershipsOf(auth.user), clubs.getMembershipRequestsOf(auth.user)])
</script>
