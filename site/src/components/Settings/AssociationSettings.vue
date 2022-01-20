<template>
    <div>{{ }}</div>
    <LoadingComponent
        v-if=" clubs === undefined || clubs === null || userClubs === undefined || userClubs === null "
        :class="$store.state.users"
        background="bg-1"
    />
    <div
        v-else
        class="text-2"
    >
        <div
            v-if="clubsThatIsPresident().length > 0"
            class="flex h-12 border-b-2 border-color-2-alt"
        >
            <button
                class="flex w-1/2 my-auto px-4"
                @click="changeSelectedComponent(1)"
            >
                <div
                    class="mx-auto flex"
                >
                    <i
                        class="my-auto text-xl"
                        :class="componentSelected==1 ? 'ri-team-fill text-blue-500' : 'ri-team-line'"
                    />
                    <p
                        class="hidden sm:block text-lg my-auto ml-4"
                        :class="componentSelected==1 ? 'text-blue-500': ''"
                    >
                        Tes associations
                    </p>
                </div>
            </button>
            <button
                class="flex w-1/2 my-auto"
                @click="changeSelectedComponent(2)"
            >
                <div
                    class="flex mx-auto"
                >
                    <i
                        class="my-auto text-xl"
                        :class="componentSelected==2 ? 'ri-tools-fill text-blue-500' : 'ri-tools-line'"
                    />
                    <p
                        class="hidden sm:block text-lg my-auto ml-4"
                        :class="componentSelected==2 ? 'text-blue-500': ''"
                    >
                        Gestion de son association
                    </p>
                </div>
            </button>
        </div>
        <!-- Gestion de ses assos (Général pour tout le monde) -->
        <div
            v-if="componentSelected===1"
            class="px-4 sm:px-8 py-4"
        >
            <div class="flex flex-col lg:flex-row">
                <div class="mb-2 lg:w-1/2">
                    <div class="flex">
                        <div class="text-lg">
                            Associations
                        </div>
                        <button
                            class="text-blue-500 ml-4 text-sm flex my-auto"
                            @click="toggleShowAddForm()"
                        >
                            <i class="ri-add-fill" />
                            <div>
                                Rejoindre une association
                            </div>
                        </button>
                    </div>
                    <div v-if="userClubs.length === 0">
                        Vous n'avez pas encore d'Association
                    </div>
                    <div
                        v-else
                        class="flex"
                    >
                        <div class="flex flex-col">
                            <div
                                v-for="(club, idx) in userClubs"
                                :key="idx"
                                class="flex mb-2 items-center h-8 mt-2"
                            >
                                <div class="mr-2 flex">
                                    <img
                                        v-if="club.club.clubId!=null"
                                        class="h-8 w-8 my-auto rounded-full"
                                        :src="club.club.icon!='' ? club.club.icon : default_avatar"
                                    >
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
                                class="flex mb-2 items-center h-8 mt-2"
                            >
                                <div class="ml-2">
                                    {{ Object.keys(roles).find((role)=> roles[role]===club.role) }}
                                </div>
                                <button
                                    class="text-1 ml-4 text-md text-red-500 my-auto flex"
                                    @click="leaveClub(club.club.clubId)"
                                >
                                    <i class="ri-close-line text-red-500 my-auto" />
                                    <p class="text-sm text-red-500 my-auto">
                                        Quitter
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="showAddForm"
                    class="lg:w-1/2 "
                >
                    <h4 class="text-md mb-4">
                        Ajouter une association
                    </h4>
                    <div class="flex gap-4 mb-4">
                        <img
                            v-if="addingClub!=null"
                            :src="clubs[addingClub].icon"
                            :alt="`${clubs[addingClub].name}'s Icon`"
                            class="h-8 w-8 rounded-full"
                        >
                        <SelectInput
                            v-model="addingClub"
                            :choices="clubs.map((a)=>a.name)"
                        />
                    </div>
                    <div class="flex">
                        <button
                            class="button"
                            @click="signUp()"
                        >
                            <p class="my-auto">
                                Sauvegarder
                            </p>
                        </button>
                        <div
                            v-if="submitSuccessNewMember===1"
                            class="text-green-500 bg-green-500 bg-opacity-25 font-bold p-2 rounded-md my-auto ml-4 flex gap-2"
                        >
                            <i class="ri-check-fill my-auto" />
                            <div class="my-auto">
                                Réussi
                            </div>
                        </div>
                        <div
                            v-else-if="submitSuccessNewMember===-1"
                            class="text-red-500 bg-red-500 bg-opacity-25 font-bold p-2 rounded-md my-auto ml-4 flex gap-2"
                        >
                            <i class="ri-close-fill my-auto" />
                            <div class="my-auto">
                                Erreur lors de l'enregistrement
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gestion des assos (pres/ vice pres) -->
        <div v-if="componentSelected===2 && clubsThatIsPresident().length > 0">
            <div class="flex">
                <div
                    v-if="clubsThatIsPresident().length>1"
                    class="flex w-1/6 flex-col px-2 py-2 border-r-2 border-color-4-alt"
                >
                    <div
                        v-for="club in clubsThatIsPresident()"
                        :key="club"
                        class="mb-8"
                    >
                        <button
                            class="flex text-left"
                            @click="changeSelectedClub(club)"
                        >
                            <img
                                :src="club.club.icon"
                                :alt="`${club.club.name} icon`"
                                class="h-8 w-8 rounded-full my-auto"
                            >
                            <div
                                class="hidden md:block my-auto ml-2"
                                :class="club.club.clubId === clubSelected.club.clubId ? 'text-blue-500' : '' "
                            >
                                {{ club.club.name }}
                            </div>
                        </button>
                    </div>
                </div>
                <div
                    class="px-4 sm:px-8 py-4 w-5/6 "
                    :class="clubsThatIsPresident().length>1 ? 'w-5/6' : 'w-full' "
                >
                    <h2 class="text-xl mb-8">
                        Gestion de votre Association
                    </h2>
                    <h3 class="text-lg mb-8">
                        Informations de l'association
                    </h3>
                    <div class="flex mb-4">
                        <div class="flex mr-6 w-full">
                            <div class="flex flex-col w-fit mr-8 mb-4">
                                <div class="relative mx-auto mb-2">
                                    <AvatarImage
                                        :src="clubSelected.club.icon"
                                        :alt="clubSelected.club.name + ' icon'"
                                        :size="32"
                                        class="w-32"
                                    />
                                    <button
                                        class="absolute md:block hidden bottom-0 left-24 "
                                        @click="showImage()"
                                    >
                                        <i class="ri-camera-line text-2xl absolute bottom-0 rounded-full border px-1 bg-2 border-color-2" />
                                    </button>
                                </div>
                                <div class="flex mx-auto justify-between">
                                    <div
                                        class="w-full bg-1 mr-2 capitalize whitespace-nowrap"
                                    >
                                        {{ clubSelected.club.name }}
                                    </div>
                                </div>
                            </div>
                            <div class="flex w-full flex-col">
                                <label
                                    for="description"
                                    class="text-lg"
                                >Description</label>
                                <textarea
                                    v-model="clubSelected.club.description"
                                    name="description"
                                    class="input resize-none"
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
                        <h3 class="text-lg mb-4">
                            Liste des Membres
                        </h3>
                        <div v-if="clubMembers != undefined && clubMembers != null">
                            <ul>
                                <li
                                    v-for="member in clubMembers"
                                    :key="member"
                                    class="flex gap-4"
                                >
                                    <avatar-image
                                        :src="member.user.avatar"
                                        :alt="`${member.user.username}'s' avatar`"
                                        size="8"
                                        class="my-auto"
                                    />
                                    <router-link
                                        class="hover:underline my-auto"
                                        :to="`/users/${member.user.userId}`"
                                    >
                                        {{ member.user.username }} {{ member.user.username.toUpperCase() }}
                                    </router-link>
                                    <SelectInput
                                        v-model="member.role"
                                        max-content-width="true"
                                        :choices="Object.keys(roles)"
                                        :model-value="Object.keys(roles).indexOf(Object.keys(roles).find((role)=> roles[role]===member.role))"
                                    />
                                    <button
                                        class="text-1 text-md text-red-500 my-auto flex"
                                        @click="kickUser(member.user.userId)"
                                    >
                                        <i class="ri-close-line text-red-500 my-auto" />
                                        <p class="text-sm text-red-500 my-auto">
                                            Virer
                                        </p>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div
                            v-else
                            class="relative mb-64 mt-32"
                        >
                            <LoadingComponent
                                background="bg-1"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LoadingComponent from "../../views/LoadingComponent.vue";
import { watch } from 'vue';
import AvatarImage from '../AvatarImage.vue';
import AvatarCropper from '../AvatarCropper/AvatarCropper.vue';
import _ from "lodash"
import SelectInput from '../Input/SelectInput.vue';

export default {
    components: { LoadingComponent, AvatarImage, AvatarCropper, SelectInput },
    data() {
        return {
            roles :{
                "Président" : 'president',
                "Vice-Président" : 'vice-president',
                "Secretaire" : 'secretary',
                "Trésorier" : 'treasurer',
                "Manager" : 'manager',
                "Membre" : 'member',
            },
            user:this.$store.state.auth.user,
            userClubs:null,
            clubSelected: null,
            componentSelected: 1,
            clubImageShown:false,
            clubMembers: null,
            showAddForm: false,
            addingClub: null,
            submitSuccessNewMember: 0
        }
    },
    computed : {
    },
    mounted() {
        if(this.user != null && this.user != undefined){
            this.$store.dispatch('auth/getUser',this.user.userId )
            watch(
                () => this.$store.state.auth.me,
                (newUser) => {
                    this.user = newUser
                }
            )
            watch(
                () => this.$store.state.users.userClubs,
                (newClubs) => {
                    this.userClubs = [...newClubs]
                    const clubPres = this.clubsThatIsPresident()
                    if (clubPres.length >0){
                        this.clubSelected = clubPres[0]
                        this.$store.dispatch('users/getClubMembers',this.clubSelected.club.clubId)
                    }
                }
            )
            watch(
                () => this.$store.state.users.clubs,
                (newClubs) =>{
                    this.clubs = [...newClubs]
                }
            )
            watch(
                () => [this.$store.state.users.clubMembers,this.clubSelected],
                () => {
                    if(_.isEqual(this.$store.state.users.clubMembers,this.clubMembers) ){
                        this.clubMembers = null
                        this.$store.dispatch('users/getClubMembers',this.clubSelected.club.clubId)
                    }else {
                        this.clubMembers = _.cloneDeep(this.$store.state.users.clubMembers)
                    }
                }
            )

            watch(
                () => this.clubMembers,
                (newClubMember) => {
                    if(newClubMember != null){
                        for(let member of newClubMember) {
                            if(Number.isInteger(member.role)){
                                member.role = this.roles[Object.keys(this.roles)[member.role]]
                                this.clubMembers.find((a)=> a.clubMemberId===member.clubMemberId).role = member.role
                                this.$store.dispatch('users/updateClubMember',{clubId: this.clubSelected.club.clubId, userId:member.user.userId,role:member.role})
                            }
                        }
                    }
                },
                {deep:true}
            )

            this.$store.dispatch('users/getUserById',this.user.userId )
            this.$store.dispatch('users/getUserClubs', this.user.userId)
            this.$store.dispatch('users/getClubs')
        }else {
            this.$router.push("/")
        }
    },
    methods: {
        showImage: function showImage() {
            if(this.clubImageShown){
                this.clubImageShown = false
            }else{
                this.clubImageShown = true
            }
        },
        clubsThatIsPresident: function clubsThatIsPresident(){
            return this.userClubs.filter((a)=> a.role==="president" || a.role === "vice-president")
        },
        changeSelectedClub: function changeSelect(club){
            this.clubSelected = club
        },
        changeSelectedComponent: function changeSelectedComponent(component){
            this.componentSelected = component
        },
        addLineClub: function addLineClub() {
            this.userClubs.push({role:null,club:{clubId:null}});
        },
        leaveClub: function leaveClub(clubId) {
            this.$store.dispatch('users/leaveClub', {clubId,userId:this.user.userId })
        },
        toggleShowAddForm: function toggleShowAddForm() {
            this.showAddForm = !this.showAddForm
        },
        signUp: function signUp() {
            this.submitSuccessNewMember = 0
            this.$store.dispatch('users/addClubMember', {clubId:this.clubs[this.addingClub].clubId,userId: this.user.userId})
                .then(
                    () => {
                        this.submitSuccessNewMember = 1
                        this.addingClub = null
                    }).catch(
                    () => {
                        this.submitSuccessNewMember = -1
                    })
        },
        kickUser: function kickUser(memberId) {
            this.$store.dispatch('users/deleteClubMember', {clubId: this.clubSelected.club.clubId,userId:memberId })
        }
    },
}
</script>
