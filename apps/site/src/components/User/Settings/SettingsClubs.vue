<template>
    <!-- TODO: Refactor all my-auto -->
    <div class="text-2 card-2">
        <HorizontalTabs
            v-model="currentTab"
            route-base="/me/clubs"
            route-name="me"
            :tabs="tabs"
            class="ml-4"
        />
        <div class="divide-y divide-gray-500/40 text-0">
            <template v-if="currentTab === MEMBER">
                <template v-if="clubs.userMemberships.length">
                    <div
                        v-for="membership in clubs.userMemberships"
                        :key="membership.team.teamId"
                        class="flex gap-3 py-2"
                    >
                        <ProfileAvatar
                            :avatar="membership.team.avatar"
                            :name="membership.team.name"
                            :size="3.5"
                            :rounded-full="false"
                        />
                        <div class="flex flex-col">
                            <div class="flex gap-1.5 font-semibold text-1">
                                <div class="font-semibold">{{ membership.team.name }}</div>
                                <div>•</div>
                                <div class="text-2">{{ clubRoleNames[membership.role].fr }}</div>
                            </div>
                            <div class="text-3">{{ membership.team.memberCount }}</div>
                        </div>
                    </div>
                </template>
                <div v-else class="flex flex-col gap-4 items-center my-6">
                    <div class="text-lg text-2">Vous n'êtes actuellement membre d'aucune association.</div>
                    <i class="text-8xl fas fa-puzzle-piece" />

                    <router-link
                        class="mt-4 text-2xl text-blue-600 dark:text-blue-400 hover-arrow-right"
                        to="/clubs"
                        >Découvrir les associations<i class="ml-2 fa fa-arrow-right"
                    /></router-link>
                </div>
            </template>
            <template v-else-if="currentTab === REQUEST">
                <template v-if="clubs.userMembershipRequests.length">
                    <div v-for="request in clubs.userMembershipRequests" :key="request" class="text-red-500">
                        {{ request }}
                    </div>
                </template>
                <div v-else class="flex flex-col gap-4 items-center my-6">
                    <div class="text-lg text-2">Vous n'avez pas de demandes d'adhésion en cours.</div>
                    <i class="text-8xl fas fa-puzzle-piece" />

                    <router-link
                        class="mt-4 text-2xl text-blue-600 dark:text-blue-400 hover-arrow-right"
                        to="/clubs"
                        >Découvrir les associations<i class="ml-2 fa fa-arrow-right"
                    /></router-link>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { clubRoleNames } from '@/shared/types/club-roles.enum'

    import { useClubsStore } from '@/store/clubs.store'
    import { useAuthStore } from '@/store/auth.store'
    import { ref } from 'vue'

    const auth = useAuthStore()
    const clubs = useClubsStore()

    const MEMBER = 'active'
    const REQUEST = 'requests'

    const currentTab = ref(null)

    const tabs = [
        {
            id: MEMBER,
            name: 'Actives',
            route: '/me/clubs',
            icon: 'users',
            component: 'club-members',
        },
        {
            id: REQUEST,
            name: 'Demandes en cours',
            icon: 'envelope',
            component: 'club-settings',
        },
    ]

    await Promise.all([clubs.getMembershipsOf(auth.user), clubs.getMembershipRequestsOf(auth.user)])

    // console.log('CLUBS', clubs)
    // await Promise.all([clubs.getClubsOf(auth.user), clubs.getRequestsOf(auth.user)])

    // import SelectInput from '@/components/Input/SelectInput.vue'
    // // import AvatarCropper from '@/components/User/AvatarCropper/AvatarCropper.vue'
    // import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    // import DrawerMenu from '@/components/DrawerMenu.vue'

    // import { emitter } from '@/shared/modules/emitter'
    // import { useAuthStore } from '@/store/auth.store'
    // import { useClubsStore } from '@/store/clubs.store'
    // import { useProfilesStore } from '@/store/profile.store'
    // // import { getStatusAxiosError } from '@/utils/errors'
    // import { ref, watch } from 'vue'

    // import _ from 'lodash'
    // import { watch } from 'vue'
    // const apiUrl = import.meta.env.VITE_API_URL
    // const profile = useProfilesStore()
    // const auth = useAuthStore()
    // const club = useClubsStore()
    // const clubs = ref([])
    // const me = ref(null)
    // const componentSelected = ref(1)
    // // const addingClub = ref(null)
    // const clubList = ref([])
    // const clubSelected = ref(null)
    // const avatarShown = ref(false)
    // const requests = ref([])
    // const members = ref([])
    // const oldMembers = ref([])

    // const userClubsPresident = () =>
    //     clubs.value.items.filter(
    //         (club) =>
    //             club.role === 'owner' ||
    //             club.role === 'coowner' ||
    //             club.role === 'treasurer' ||
    //             club.role === 'secretary',
    //     )

    // const changeSelectedClub = async (club) => {
    //     if (userClubsPresident().length > 0) {
    //         clubSelected.value = userClubsPresident()[club]
    //         await loadRequests(clubSelected.value.team.teamId)
    //         await loadMembers(clubSelected.value.team.teamId)
    //     }
    // }
    // const showImage = () => {
    //     avatarShown.value = !avatarShown.value
    // }

    // const roles = {
    //     'Président': 'owner',
    //     'Vice-président': 'coowner',
    //     'Trésorier': 'treasurer',
    //     'Secrétaire': 'secretary',
    //     'Bureau': 'manager',
    //     'Membre': 'member',
    // }

    // const changeSelectedComponent = (numb) => {
    //     componentSelected.value = numb
    // }

    // const loadMe = async () => {
    //     await auth
    //         .getMe()
    //         .then((res) => {
    //             me.value = res
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatus(err.response) })
    //         })
    // }

    // const cropUploadSuccess = async (data) => {
    //     await club
    //         .patchClub(clubSelected.value.team.teamId, {
    //             avatar: data.profileImageId,
    //         })
    //         .then((res) => {
    //             clubSelected.value.team = res
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatus(err.response) })
    //         })
    // }

    // const loadClubs = async () => {
    //     const userId = me.value.userId
    //     await profile
    //         .getClubs(userId)
    //         .then(async (res) => {
    //             clubs.value = res
    //             if (userClubsPresident().length > 0) {
    //                 clubSelected.value = userClubsPresident()[0]
    //                 const teamId = clubSelected.value.team.teamId
    //                 loadRequests(teamId)
    //                 loadMembers(teamId)
    //             }
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatus(err.response) })
    //         })
    // }

    // const loadClubList = async () => {
    //     await profile
    //         .getClubsList()
    //         .then((res) => {
    //             clubList.value = res
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatus(err.response) })
    //         })
    // }

    // const loadRequests = async (teamId) => {
    //     await profile
    //         .getMembershipsRequests(teamId)
    //         .then((res) => {
    //             requests.value = res.items
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatus(err.response) })
    //         })
    // }

    // const acceptDemand = async (request) => {
    //     await profile
    //         .acceptMembershipRequest(request.teamMembershipRequestId)
    //         .then(() => {
    //             loadRequests(clubSelected.value.team.teamId)
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatus(err.response) })
    //         })
    // }

    // const loadMembers = async (teamId) => {
    //     await profile
    //         .getMembers(teamId)
    //         .then((res) => {
    //             members.value = res.items
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatus(err.response) })
    //         })
    //     oldMembers.value = JSON.parse(JSON.stringify(members.value))
    // }

    // //TODO leaveClub

    // const kickMember = async (userId) => {
    //     await profile
    //         .removeMember(userId, clubSelected.value.team.teamId)
    //         .then(() => {
    //             loadMembers(clubSelected.value.team.teamId)
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatus(err.response) })
    //         })
    // }

    // const patchClub = async () => {
    //     const { description, membershipRequestLink, membershipRequestMessage } = {
    //         ...clubSelected.value.team,
    //     }
    //     await club
    //         .patchClub(clubSelected.value.team.teamId, {
    //             description,
    //             membershipRequestLink,
    //             membershipRequestMessage,
    //         })
    //         .then((res) => {
    //             clubSelected.value.team = res
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatus(err.response) })
    //         })
    // }

    // const patchMembership = async () => {
    //     const changes = members.value.filter((member) => {
    //         const memb = oldMembers.value.find((old) => old.user.userId === member.user.userId)
    //         return member.role != memb.role || member.roleLabel != memb.roleLabel
    //     })
    //     changes.map(async (membership) => {
    //         await club
    //             .patchMembership(membership.team.teamId, membership.user.userId, {
    //                 role: membership.role,
    //                 roleLabel: membership.roleLabel,
    //             })
    //             .then(() => {
    //                 loadMembers(clubSelected.value.team.teamId)
    //             })
    //     })
    // }

    // await loadMe()
    // await loadClubs()
    // await loadClubList()

    // watch(clubSelected, async () => {
    //     if (Number.isInteger(clubSelected.value)) {
    //         await changeSelectedClub(clubSelected.value)
    //     }
    // })
    // watch(
    //     members,
    //     () => {
    //         members.value.map((member) => {
    //             if (Number.isInteger(member.role)) {
    //                 member.role = roles[Object.keys(roles)[member.role]]
    //             }
    //         })
    //     },
    //     {
    //         deep: true,
    //     },
    // )
    // export default {
    //     data() {
    //         return {
    //             user: this.$store.state.auth.user,
    //             userClubs: this.$store.state.user.clubs,
    //             clubSelected: null,
    //             componentSelected: 1,
    //             clubImageShown: false,
    //             clubMembers: null,
    //             showAddForm: false,
    //             addingClub: null,
    //             submitSuccessNewMember: 0,
    //         }
    //     },
    //     computed: {
    //         clubs() {
    //             return this.$store.state.user.enumClubs
    //         },
    //         userClubsPresident() {
    //             return this.userClubs.filter((club) => club.role === 'president')
    //         },
    //         clubsLoaded() {
    //             return this.$store.state.user.clubsLoaded
    //         },
    //     },
    //     mounted() {
    //         if (this.user != null && this.user != undefined) {
    //             this.$store.dispatch('user/getClubs')
    //         }
    //     },
    //     methods: {
    //         showImage: function showImage() {
    //             if (this.clubImageShown) {
    //                 this.clubImageShown = false
    //             } else {
    //                 this.clubImageShown = true
    //             }
    //         },
    //         changeSelectedClub: function changeSelect(club) {
    //             this.clubSelected = club
    //         },
    //         changeSelectedComponent: function changeSelectedComponent(component) {
    //             this.componentSelected = component
    //         },
    //         addLineClub: function addLineClub() {
    //             this.userClubs.push({
    //                 role: null,
    //                 club: { clubId: null },
    //             })
    //         },
    //         toggleShowAddForm: function toggleShowAddForm() {
    //             this.showAddForm = !this.showAddForm
    //         },
    //         signUp: function signUp() {
    //             this.submitSuccessNewMember = 0
    //             this.$store
    //                 .dispatch('user/addClubMember', {
    //                     clubId: this.clubs[this.addingClub].clubId,
    //                     userId: this.user.userId,
    //                 })
    //                 .then(() => {
    //                     this.submitSuccessNewMember = 1
    //                     this.addingClub = null
    //                 })
    //                 .catch(() => {
    //                     this.submitSuccessNewMember = -1
    //                 })
    //         },
    //         kickUser: function kickUser(memberId) {
    //             this.$store.dispatch('user/deleteClubMember', {
    //                 clubId: this.clubSelected.club.clubId,
    //                 userId: memberId,
    //             })
    //         },
    //         leaveClub: function leaveClub(clubId) {
    //             this.$store.dispatch('user/deleteClubMember', {
    //                 clubId,
    //                 userId: this.user.userId,
    //             })
    //         },
    //     },
    // }
</script>

<style lang="scss">
    .hover-arrow-right {
        transition: color 0.3s ease-in-out;

        & i {
            transition: transform 0.3s ease-in-out;
        }

        &:hover {
            @apply text-blue-600;

            .dark & {
                color: #0af;
            }

            & i {
                transform: translateX(6px);
            }
        }
    }
</style>
