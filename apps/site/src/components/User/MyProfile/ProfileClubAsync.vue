<template>
    <!-- TODO: Refactor all my-auto -->
    <div class="text-2">
        <div class="flex h-12 border-b-2 border-color-2-alt">
            <button
                v-if="userClubsPresident().length > 0"
                class="flex px-4 my-auto w-1/2"
                @click="changeSelectedComponent(1)"
            >
                <div class="flex mx-auto">
                    <font-awesome-icon
                        :icon="componentSelected === 1 ? 'user-friends' : ['far', 'user-friends']"
                        :class="{ 'text-blue-500': componentSelected == 1 }"
                        size="lg"
                    />
                    <p
                        class="hidden my-auto ml-4 text-lg sm:block"
                        :class="{ 'text-blue-500': componentSelected == 1 }"
                    >
                        Tes associations
                    </p>
                </div>
            </button>
            <button class="flex my-auto w-1/2" @click="changeSelectedComponent(2)">
                <div class="flex mx-auto">
                    <font-awesome-icon
                        icon="tools"
                        :class="{ 'text-blue-500': componentSelected == 2 }"
                        class="my-auto text-lg"
                    />
                    <p
                        class="hidden my-auto ml-4 text-lg sm:block"
                        :class="{ 'text-blue-500': componentSelected == 2 }"
                    >
                        Gestion de son association
                    </p>
                </div>
            </button>
        </div>
        <!-- Gestion de ses assos (Général pour tout le monde) -->
        <div v-if="componentSelected === 1" class="p-4 sm:px-8">
            <div class="flex flex-col">
                <div class="mb-2">
                    <div id="userClubs">
                        <div class="flex">
                            <h1 class="text-lg">Tes associations</h1>
                            <a class="flex gap-2 my-auto ml-4 text-sm text-blue-500" href="#clubs">
                                <font-awesome-icon class="my-auto" icon="plus" />
                                <div class="my-auto">Rejoindre une association</div>
                            </a>
                        </div>
                        <div v-if="clubs.items.length === 0" class="mb-8">
                            Vous n'avez pas encore rejoint d'Association
                        </div>
                        <table v-else class="w-full">
                            <tr
                                v-for="(club, idx) in clubs.items"
                                :key="idx"
                                class="flex gap-2 items-center w-full even:bg-gray-200"
                            >
                                <td class="flex gap-2 my-1 w-60">
                                    <UserAvatar
                                        :img-src="club.team.avatar"
                                        size="2"
                                        :username="club.team.name"
                                    />
                                    <div class="truncate">
                                        {{ club.team.name }}
                                    </div>
                                </td>
                                <td class="flex gap-2 items-center w-24">
                                    <div>
                                        {{ Object.keys(roles).find((role) => roles[role] === club.role) }}
                                    </div>
                                    <button
                                        class="flex text-red-500 text-1 text-md"
                                        @click="leaveClub(club.team.teamId)"
                                    >
                                        <font-awesome-icon icon="times" class="text-red-500" />
                                        <p class="my-auto text-sm text-red-500">Quitter</p>
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="join">
                        <div>
                            <div class="flex">
                                <h1 class="text-lg">Associations proposées</h1>
                            </div>
                            <p class="text-sm">
                                Vous pouvez rejoindre une association en cliquant sur le bouton "Rejoindre une
                                association"
                            </p>
                        </div>
                        <table class="w-full">
                            <tr
                                v-for="club in clubList.items"
                                :key="club"
                                class="flex gap-2 items-center w-full even:bg-gray-200"
                            >
                                <td class="flex gap-2 my-1 w-60">
                                    <UserAvatar :img-src="club.avatar" size="2" :username="club.name" />
                                    <div class="my-auto truncate w-50">
                                        {{ club.name }}
                                    </div>
                                </td>
                                <td class="flex gap-2 w-12 text-sm">
                                    <p class="my-auto">{{ club.memberCount }}</p>
                                    <i class="my-auto fas fa-users"></i>
                                </td>
                                <td>
                                    <button class="my-auto text-sm text-blue-500">
                                        Demander à rejoindre
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gestion des assos (pres/ vice pres) -->
        <div v-if="componentSelected === 2 && userClubsPresident().length > 0">
            <div class="">
                <div class="p-4 w-full sm:px-8">
                    <div class="flex gap-2 items-center mb-8">
                        <h2 class="text-xl">Gestion de votre Association :</h2>
                        <div v-if="userClubsPresident().length > 1">
                            <SelectInput
                                v-model="clubSelected"
                                :choices="userClubsPresident().map((a) => a.team.name)"
                                :model-value="
                                    userClubsPresident().findIndex(
                                        (a) => clubSelected.team.teamId === a.team.teamId,
                                    )
                                "
                            />
                        </div>
                        <div v-else>
                            {{ clubSelected.team.name }}
                        </div>
                    </div>
                    <div>
                        <div>
                            <div class="flex my-4">
                                <div class="flex mr-6 w-full">
                                    <div class="flex flex-col mr-8 mb-4 w-fit">
                                        <div class="relative mx-auto mb-2">
                                            <UserAvatar
                                                :img-src="clubSelected.team.avatar"
                                                :alt="clubSelected.team.name + ' icon'"
                                                :size="5"
                                                :username="clubSelected.team.name"
                                            />
                                            <button
                                                class="hidden absolute right-4 bottom-0 md:block"
                                                @click="showImage()"
                                            >
                                                <i
                                                    class="absolute -bottom-2 px-1 text-lg rounded-full border fa fa-camera bg-2 border-color-2"
                                                />
                                            </button>
                                        </div>
                                        <div class="flex justify-between mx-auto">
                                            <div class="mr-2 w-full capitalize whitespace-nowrap bg-1">
                                                {{ clubSelected.team.name }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col w-full">
                                        <label for="description" class="text-lg">Description</label>
                                        <textarea
                                            v-model="clubSelected.team.description"
                                            name="description"
                                            class="resize-none input"
                                            rows="5"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col w-full">
                                <label for="description" class="text-lg">Description</label>
                                <textarea
                                    v-model="clubSelected.team.description"
                                    name="description"
                                    class="resize-none input"
                                    rows="5"
                                />
                                <button class="mt-2 button" @click="patchDescription()">
                                    <p>Enregistrer</p>
                                </button>
                            </div>
                        </div>
                    </div>
                    <AvatarCropper
                        v-model="avatarShown"
                        field="file"
                        img-format="jpg"
                        :url="`${apiUrl}/files/profile-images`"
                        lang-type="fr"
                        :with-credentials="true"
                        @crop-upload-success="cropUploadSuccess"
                    />
                    <div>
                        <DrawerMenu class="mt-8" title="Invitations en attente">
                            <template #default>
                                <div v-if="requests.length > 0" class="flex">
                                    <table>
                                        <tr
                                            v-for="request in requests"
                                            :key="request.teamMembershipRequestId"
                                            class="flex gap-8 items-center even:bg-gray-200"
                                        >
                                            <td class="flex gap-2 items-center w-44">
                                                <UserAvatar
                                                    :img-src="request.user.avatar"
                                                    :alt="request.user.name + ' icon'"
                                                    :size="2"
                                                    :username="
                                                        request.user.firstname + ' ' + request.user.lastname
                                                    "
                                                />
                                                <div class="truncate">
                                                    {{ request.user.firstname + ' ' + request.user.lastname }}
                                                </div>
                                            </td>
                                            <td class="w-24">
                                                <p class="my-auto text-sm text-green-500">
                                                    {{ request.state }}
                                                </p>
                                            </td>
                                            <td>
                                                <button
                                                    class="my-auto text-sm text-blue-500"
                                                    @click="() => acceptDemand(request)"
                                                >
                                                    Accepter la demande
                                                </button>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div v-else>Vous n'avez pas de demandes d'adhésions en attente</div>
                            </template>
                        </DrawerMenu>
                        <h3 class="mt-8 text-lg"></h3>
                    </div>
                    <div>
                        <h3 class="mt-8 text-lg">Liste des Membres</h3>
                        <table class="w-full">
                            <tr
                                v-for="member in members"
                                :key="member.teamMemberId"
                                class="flex gap-4 items-center w-full even:bg-gray-200"
                            >
                                <td class="my-1">
                                    <UserAvatar
                                        :img-src="member.user.avatar"
                                        :alt="member.user.name + ' icon'"
                                        :size="2"
                                        :username="member.user.firstname + ' ' + member.user.lastname"
                                    />
                                </td>
                                <td class="w-60 truncate">
                                    {{ member.user.firstname + ' ' + member.user.lastname }}
                                </td>
                                <td class="w-32">
                                    {{
                                        member.roleLabel
                                            ? member.roleLabel
                                            : Object.keys(roles).find((role) => roles[role] === member.role)
                                    }}
                                </td>
                                <td class="w-48">
                                    <button v-if="member.role === 'owner'" class="text-red-500">
                                        Transmettre le rôle
                                    </button>
                                    <button
                                        v-else
                                        class="text-red-500"
                                        @click="() => kickMember(member.user.userId)"
                                    >
                                        Virer de l'association
                                    </button>
                                </td>
                            </tr>
                        </table>
                        <!-- <div v-if="clubMembers != undefined && clubMembers != null">
                            <ul>
                                <li v-for="member in clubMembers" :key="member" class="flex gap-4">
                                    <UserAvatar
                                        :src="member.user.avatar"
                                        :alt="`${member.user.fullname}'s' avatar`"
                                        size="8"
                                        class="my-auto"
                                    />
                                    <router-link
                                        class="my-auto hover:underline"
                                        :to="`/users/${member.user.userId}`"
                                    >
                                        {{ member.user.fullname }} {{ member.user.fullname.toUpperCase() }}
                                    </router-link>

                                    <SelectInput
                                        v-model="member.role"
                                        max-content-width="true"
                                        :choices="Object.keys(roles)"
                                        :model-value="
                                            Object.keys(roles).indexOf(
                                                Object.keys(roles).find(
                                                    (role) => roles[role] === member.role,
                                                ),
                                            )
                                        "
                                    />

                                    <button
                                        class="flex my-auto text-red-500 text-1 text-md"
                                        @click="kickUser(member.user.userId)"
                                    >
                                        <font-awesome-icon icon="times" class="my-auto text-red-500" />
                                        <p class="my-auto text-sm text-red-500">Virer</p>
                                    </button>
                                </li>
                            </ul>
                        </div> -->
                    </div>
                    <div>
                        <h3 class="mt-8 text-lg">Paramètres de l'adhésion</h3>
                        <p class="mb-2 text-sm">
                            Lors de sa demande d'adhésion, un utilisateur recevra une pop-up personnalisable :
                            vous pouvez lui laisser un message et le rediriger vers un espace permettant de
                            lui demander plus d'informations
                        </p>
                        <form action="">
                            <div class="flex flex-col gap-2">
                                <label class="my-auto" for="adhesion_msg">Message d'adhésion</label>
                                <textarea
                                    id="adhesion_msg"
                                    class="resize-none input"
                                    name="adhesion_msg"
                                    rows="3"
                                    placeholder="Exemple : Merci d'avoir demandé à rejoindre notre formidable association, afin de finir votre inscription veuillez remplir le formulaire ci-dessous : "
                                ></textarea>
                                <label class="my-auto" for="adhesion_link"
                                    >Lien de complétion de candidature</label
                                >
                                <input
                                    id="adhesion_link"
                                    class="input"
                                    name="adhesion_link"
                                    type="text"
                                    placeholder="Exemple : https://docs.google.com/forms/d/e/exemple/viewform?usp=sf_link"
                                />
                            </div>
                        </form>
                        <button class="mt-2 button" @click="patchDescription()">
                            <p>Enregistrer</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import SelectInput from '@/components/Input/SelectInput.vue'
    import AvatarCropper from '@/components/User/AvatarCropper/AvatarCropper.vue'
    import UserAvatar from '@/components/User/UserAvatar.vue'
    import { emitter } from '@/shared/modules/emitter'
    import { useAuthStore } from '@/store/auth.store'
    import { useClubsStore } from '@/store/clubs.store'
    import { useProfilesStore } from '@/store/profile.store'
    import { getStatus } from '@/utils/errors'
    import { ref, watch } from 'vue'
    import DrawerMenu from '@/components/DrawerMenu.vue'

    // import _ from 'lodash'
    // import { watch } from 'vue'
    const apiUrl = import.meta.env.VITE_API_URL
    const profile = useProfilesStore()
    const auth = useAuthStore()
    const club = useClubsStore()
    const clubs = ref([])
    const me = ref(null)
    const componentSelected = ref(1)
    // const addingClub = ref(null)
    const clubList = ref([])
    const clubSelected = ref(null)
    const avatarShown = ref(false)
    const requests = ref([])
    const members = ref([])
    const oldMembers = ref([])

    const userClubsPresident = () =>
        clubs.value.items.filter(
            (club) =>
                club.role === 'owner' ||
                club.role === 'coowner' ||
                club.role === 'treasurer' ||
                club.role === 'secretary',
        )

    const changeSelectedClub = async (club) => {
        if (userClubsPresident().length > 0) {
            clubSelected.value = userClubsPresident()[club]
            await loadRequests(clubSelected.value.team.teamId)
            await loadMembers(clubSelected.value.team.teamId)
        }
    }
    const showImage = () => {
        avatarShown.value = !avatarShown.value
    }

    const roles = {
        'Président': 'owner',
        'Vice-président': 'coowner',
        'Trésorier': 'treasurer',
        'Secrétaire': 'secretary',
        'Bureau': 'manager',
        'Membre': 'member',
    }

    const changeSelectedComponent = (numb) => {
        componentSelected.value = numb
    }

    const loadMe = async () => {
        await auth
            .getMe()
            .then((res) => {
                me.value = res
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
    }

    const cropUploadSuccess = async (data) => {
        await club
            .patchClub(clubSelected.value.team.teamId, {
                avatar: data.profileImageId,
            })
            .then((res) => {
                clubSelected.value.team = res
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
    }

    const loadClubs = async () => {
        const userId = me.value.userId
        await profile
            .getClubs(userId)
            .then(async (res) => {
                clubs.value = res
                if (userClubsPresident().length > 0) {
                    clubSelected.value = userClubsPresident()[0]
                    const teamId = clubSelected.value.team.teamId
                    loadRequests(teamId)
                    loadMembers(teamId)
                }
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
    }

    const loadClubList = async () => {
        await profile
            .getClubsList()
            .then((res) => {
                clubList.value = res
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
    }

    const loadRequests = async (teamId) => {
        await profile
            .getMembershipsRequests(teamId)
            .then((res) => {
                requests.value = res.items
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
    }

    const acceptDemand = async (request) => {
        await profile
            .acceptMembershipRequest(request.teamMembershipRequestId)
            .then(() => {
                loadRequests(clubSelected.value.team.teamId)
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
    }

    const loadMembers = async (teamId) => {
        await profile
            .getMembers(teamId)
            .then((res) => {
                members.value = res.items
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
        oldMembers.value = JSON.parse(JSON.stringify(members.value))
    }

    //TODO leaveClub

    const kickMember = async (userId) => {
        await profile
            .removeMember(userId, clubSelected.value.team.teamId)
            .then(() => {
                loadMembers(clubSelected.value.team.teamId)
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
    }

    const patchDescription = async () => {
        await club
            .patchClub(clubSelected.value.team.teamId, {
                description: clubSelected.value.team.description,
            })
            .then((res) => {
                clubSelected.value.team = res
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
    }

    const patchAdhesion = async () => {
        await club
            .patchClub(clubSelected.value.team.teamId, {
                adhesionLink: clubSelected.value.team.adhesionLink,
            })
            .then((res) => {
                clubSelected.value.team = res
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
    }

    await loadMe()
    await loadClubs()
    await loadClubList()
    watch(clubSelected, async () => {
        if (Number.isInteger(clubSelected.value)) {
            await changeSelectedClub(clubSelected.value)
        }
    })
    watch(
        members,
        () => {
            members.value.map((member) => {
                if (Number.isInteger(member.role)) {
                    member.role = roles[Object.keys(roles)[member.role]]
                }
            })
        },
        {
            deep: true,
        },
    )
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
