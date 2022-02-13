<template>
    <!-- TODO: Refactor all my-auto -->
    <div v-if="!clubsLoaded" class="relative h-32">
        <AppLoader />
    </div>
    <div v-else class="text-2">
        <div v-if="userClubsPresident.length > 0" class="flex h-12 border-b-2 border-color-2-alt">
            <button class="flex px-4 my-auto w-1/2" @click="changeSelectedComponent(1)">
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
            <div class="flex flex-col lg:flex-row">
                <div class="mb-2 lg:w-1/2">
                    <div class="flex">
                        <div class="text-lg">Associations</div>
                        <button
                            v-if="!showAddForm"
                            class="flex gap-2 my-auto ml-4 text-sm text-blue-500"
                            @click="toggleShowAddForm()"
                        >
                            <font-awesome-icon class="my-auto" icon="plus" />
                            <div class="my-auto">Rejoindre une association</div>
                        </button>
                        <button
                            v-else
                            class="flex gap-2 my-auto ml-4 text-sm text-red-500"
                            @click="toggleShowAddForm()"
                        >
                            <font-awesome-icon icon="times" class="my-auto" />
                            <div class="my-auto">Fermer le menu</div>
                        </button>
                    </div>
                    <div v-if="userClubs.length === 0">Vous n'avez pas encore d'Association</div>
                    <div v-else class="flex">
                        <div class="flex flex-col">
                            <div
                                v-for="(club, idx) in userClubs"
                                :key="idx"
                                class="flex items-center my-2 h-8"
                            >
                                <div class="flex mr-2">
                                    <img
                                        v-if="club.club.clubId != null"
                                        class="my-auto w-8 h-8 rounded-full"
                                        :src="club.club.icon"
                                    />
                                    <div class="my-auto ml-2">
                                        {{ club.club.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div
                                v-for="(club, idx) in userClubs"
                                :key="idx"
                                class="flex items-center my-2 h-8"
                            >
                                <div class="ml-2">
                                    {{ Object.keys(roles).find((role) => roles[role] === club.role) }}
                                </div>
                                <button
                                    class="flex my-auto ml-4 text-red-500 text-1 text-md"
                                    @click="leaveClub(club.club.clubId)"
                                >
                                    <font-awesome-icon icon="times" class="my-auto text-red-500" />
                                    <p class="my-auto text-sm text-red-500">Quitter</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="showAddForm" class="lg:w-1/2">
                    <h4 class="mb-4 text-md">Ajouter une association</h4>
                    <div class="flex gap-4 mb-4">
                        <img
                            v-if="addingClub != null"
                            :src="clubs[addingClub].icon"
                            :alt="`${clubs[addingClub].name}'s Icon`"
                            class="w-8 h-8 rounded-full"
                        />
                        <SelectInput v-model="addingClub" :choices="clubs.map((a) => a.name)" />
                    </div>
                    <div class="flex">
                        <button class="button" @click="signUp()">
                            <p class="my-auto">Sauvegarder</p>
                        </button>
                        <div
                            v-if="submitSuccessNewMember === 1"
                            class="flex gap-2 p-2 my-auto ml-4 font-bold text-green-600 bg-green-500 rounded-md bg-opacity-/25"
                        >
                            <font-awesome-icon icon="check" class="my-auto" />
                            <div class="my-auto">Réussi</div>
                        </div>
                        <div
                            v-else-if="submitSuccessNewMember === -1"
                            class="flex gap-2 p-2 my-auto ml-4 font-bold text-red-500 bg-red-500 rounded-md bg-opacity-/25"
                        >
                            <font-awesome-icon icon="times" class="my-auto" />
                            <div class="my-auto">Erreur lors de l'enregistrement</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gestion des assos (pres/ vice pres) -->
        <div v-if="componentSelected === 2 && userClubsPresident.length > 0">
            <div class="flex">
                <div
                    v-if="userClubsPresident.length > 1"
                    class="flex flex-col p-2 w-1/6 border-r-2 border-color-4-alt"
                >
                    <div v-for="club in userClubsPresident" :key="club" class="mb-8">
                        <button class="flex text-left" @click="changeSelectedClub(club)">
                            <img
                                :src="club.club.icon"
                                :alt="`${club.club.name} icon`"
                                class="my-auto w-8 h-8 rounded-full"
                            />
                            <div
                                class="hidden my-auto ml-2 md:block"
                                :class="club.club.clubId === clubSelected.club.clubId ? 'text-blue-500' : ''"
                            >
                                {{ club.club.name }}
                            </div>
                        </button>
                    </div>
                </div>
                <div class="p-4 w-5/6 sm:px-8" :class="userClubsPresident.length > 1 ? 'w-5/6' : 'w-full'">
                    <h2 class="mb-8 text-xl">Gestion de votre Association</h2>
                    <h3 class="mb-8 text-lg">Informations de l'association</h3>
                    <div class="flex mb-4">
                        <div class="flex mr-6 w-full">
                            <div class="flex flex-col mr-8 mb-4 w-fit">
                                <div class="relative mx-auto mb-2">
                                    <UserAvatar
                                        :src="clubSelected.club.icon"
                                        :alt="clubSelected.club.name + ' icon'"
                                    />
                                    <button
                                        class="hidden absolute bottom-0 left-24 md:block"
                                        @click="showImage()"
                                    >
                                        <font-awesome-icon
                                            icon="camera"
                                            class="absolute bottom-0 px-1 text-lg rounded-full border bg-2 border-color-2"
                                        />
                                    </button>
                                </div>
                                <div class="flex justify-between mx-auto">
                                    <div class="mr-2 w-full capitalize whitespace-nowrap bg-1">
                                        {{ clubSelected.club.name }}
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col w-full">
                                <label for="description" class="text-lg">Description</label>
                                <textarea
                                    v-model="clubSelected.club.description"
                                    name="description"
                                    class="resize-none input"
                                    rows="5"
                                />
                            </div>
                        </div>
                    </div>

                    <AvatarCropper
                        v-model="clubImageShown"
                        field="file"
                        img-format="jpg"
                        :url="`${API_URL}files/profile-images`"
                        lang-type="fr"
                        :with-credentials="true"
                    />

                    <div>
                        <h3 class="mb-4 text-lg">Liste des Membres</h3>
                        <div v-if="clubMembers != undefined && clubMembers != null">
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
                        </div>
                        <div v-else class="relative mt-32 mb-64">
                            <AppLoader />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AppLoader from '@/components/App/AppLoader.vue'
    import SelectInput from '@/components/Input/SelectInput.vue'
    import AvatarCropper from '@/components/User/AvatarCropper/AvatarCropper.vue'
    import UserAvatar from '@/components/User/UserAvatar.vue'
    // import _ from 'lodash'
    // import { watch } from 'vue'

    export default {
        components: {
            AppLoader,
            UserAvatar,
            AvatarCropper,
            SelectInput,
        },
        data() {
            return {
                roles: {
                    'Président': 'president',
                    'Vice-Président': 'vice-president',
                    'Secretaire': 'secretary',
                    'Trésorier': 'treasurer',
                    'Manager': 'manager',
                    'Membre': 'member',
                },
                user: this.$store.state.auth.user,
                userClubs: this.$store.state.user.clubs,
                clubSelected: null,
                componentSelected: 1,
                clubImageShown: false,
                clubMembers: null,
                showAddForm: false,
                addingClub: null,
                submitSuccessNewMember: 0,
            }
        },
        computed: {
            clubs() {
                return this.$store.state.user.enumClubs
            },
            userClubsPresident() {
                return this.userClubs.filter((club) => club.role === 'president')
            },
            clubsLoaded() {
                return this.$store.state.user.clubsLoaded
            },
        },
        mounted() {
            if (this.user != null && this.user != undefined) {
                this.$store.dispatch('user/getClubs')
            }
        },
        methods: {
            showImage: function showImage() {
                if (this.clubImageShown) {
                    this.clubImageShown = false
                } else {
                    this.clubImageShown = true
                }
            },
            changeSelectedClub: function changeSelect(club) {
                this.clubSelected = club
            },
            changeSelectedComponent: function changeSelectedComponent(component) {
                this.componentSelected = component
            },
            addLineClub: function addLineClub() {
                this.userClubs.push({
                    role: null,
                    club: { clubId: null },
                })
            },
            toggleShowAddForm: function toggleShowAddForm() {
                this.showAddForm = !this.showAddForm
            },
            signUp: function signUp() {
                this.submitSuccessNewMember = 0
                this.$store
                    .dispatch('user/addClubMember', {
                        clubId: this.clubs[this.addingClub].clubId,
                        userId: this.user.userId,
                    })
                    .then(() => {
                        this.submitSuccessNewMember = 1
                        this.addingClub = null
                    })
                    .catch(() => {
                        this.submitSuccessNewMember = -1
                    })
            },
            kickUser: function kickUser(memberId) {
                this.$store.dispatch('user/deleteClubMember', {
                    clubId: this.clubSelected.club.clubId,
                    userId: memberId,
                })
            },
            leaveClub: function leaveClub(clubId) {
                this.$store.dispatch('user/deleteClubMember', {
                    clubId,
                    userId: this.user.userId,
                })
            },
        },
    }
</script>
