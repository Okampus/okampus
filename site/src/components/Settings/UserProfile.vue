<template>
    {{ }}
    <div
        v-if="user===undefined || user===null || clubs === undefined || clubs === null || socials === undefined || socials === null "
        :class="$store.state.users "
    >
        Undefined
    </div>
    <div
        v-else
        class="px-8 py-4 text-2"
    >
        <h2 class="text-xl">
            Profil
        </h2>
        <p class="text-sm mb-6">
            Vos informations personnelles publiques
        </p>
        <div>
            <div>
                <div class="flex mb-4">
                    <div class="mr-6 w-full">
                        <div class="flex mb-4">
                            <div class="mr-2 w-1/2">
                                <label
                                    for="firstname"
                                    class="text-lg"
                                >Prénom</label>
                                <input
                                    id="firstname"
                                    v-model="user.username"
                                    type="text"
                                    name="firstname"
                                    class="w-full input bg-1"
                                >
                            </div>
                            <div class="ml-2 w-1/2">
                                <label
                                    for="lastname"
                                    class="text-lg"
                                >Nom</label>
                                <input
                                    id="lastname"
                                    v-model="user.username"
                                    type="text"
                                    name="lastname"
                                    class="w-full input bg-1 uppercase"
                                >
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <label
                                for="description"
                                class="text-lg"
                            >Description</label>
                            <textarea
                                id="description"
                                v-model="user.description"
                                name="description"
                                class="input"
                            />
                        </div>
                    </div>
                    <div class="flex-shrink-0">
                        <div class="relative">
                            <img
                                src="@/assets/img/default_avatars/user.png"
                                alt="img"
                                class="rounded-full h-48 w-48"
                            >
                            <i class="ri-camera-line text-2xl border rounded-full py-1 px-2 bg-2 border-color-2 absolute bottom-0 right-2" />
                        </div>
                    </div>
                </div>
                <div class="flex mb-4 space-x-4">
                    <div class="flex flex-col">
                        <label
                            for="parcours"
                            class="text-lg w-full"
                        >Parcours</label>
                        <SelectInput
                            v-model="parcours"
                            :choices="['Parcours Ingénieur','Parcours Expert (PEx)']"
                        />
                    </div>
                    <div class="flex flex-col">
                        <label
                            for="promo"
                            class="text-lg w-full"
                        >Promotion</label>
                        <SelectInput
                            v-model="promotion"
                            :choices="['L1','L2','L3','M1','M2']"
                        />
                    </div>
                    <div class="w-40">
                        <label
                            for="td"
                            class="text-lg"
                        >Groupe de TD</label>
                        <SelectInput
                            v-model="promotion"
                            :choices="['Int1','Int2','Int3','Int4','A','B','C','D','E','F','G','BN','BDX']"
                        />
                    </div>
                </div>
                <div class="mb-4">
                    <div class="text-lg">
                        Associations
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
                                class="flex mb-2 items-center"
                            >
                                <div class="mr-2">
                                    <SelectInput
                                        v-model="userClubs[idx].club"
                                        button-name="Association"
                                        :choices="clubs.map(a=>a.name)"
                                        :model-value="clubs.indexOf(clubs.find((a)=> a.clubId === club.club.clubId))"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div
                                v-for="(club, idx) in userClubs"
                                :key="idx"
                                class="flex mb-2 items-center"
                            >
                                <div class="ml-2">
                                    <SelectInput
                                        v-model="userClubs[idx].role"
                                        button-name="Role"
                                        :choices="roles"
                                        :model-value="roles.indexOf(club.role)"
                                    />
                                </div>
                                <button
                                    class="text-1 text-xl red-500 h-8 w-8 my-auto"
                                    @click="rmLineClub(idx)"
                                >
                                    <i class="ri-close-line" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        class="button my-2"
                        @click="addLineClub()"
                    >
                        <p>Ajouter une Association</p>
                    </button>
                </div>
                <div class="mb-4 ">
                    <div class="text-lg">
                        Comptes Externes
                    </div>
                    <div v-if="socialsAccounts.length === 0">
                        Vous n'avez pas encore lié de compte externe
                    </div>

                    <div class="flex">
                        <div class="flex flex-col">
                            <div
                                v-for="(social, idx) in socialsAccounts"
                                :key="idx"
                                class="flex mb-2 items-center"
                            >
                                <div class="flex">
                                    <i
                                        v-if="social.social.socialId!=null"
                                        class="mr-2 my-auto"
                                        :class="socials.find((a)=> a.socialId === social.social.socialId).icon"
                                    />
                                    <SelectInput
                                        v-model="social.social"
                                        :choices="socials.map(sos=> sos.name)"
                                        :model-value="socials.indexOf(socials.find((a)=> a.socialId === social.social.socialId))"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div
                                v-for="(social, idx) in socialsAccounts"
                                :key="idx"
                                class="flex mb-2 items-center"
                            >
                                <input
                                    v-model="social.pseudo"
                                    class="input ml-2"
                                    placeholder="Pseudo"
                                >
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div
                                v-for="(social, idx) in socialsAccounts"
                                :key="idx"
                                class="flex mb-2 items-center"
                            >
                                <div class="">
                                    <input
                                        v-model="social.link"
                                        class="input ml-2"
                                        placeholder="Lien"
                                    >
                                    <button
                                        class="text-1 text-xl red-500 h-8 w-8"
                                        @click="rmLineAccount(idx)"
                                    >
                                        <i class="ri-close-line" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    class="
                            button
                            my-2"
                    @click="addLineAccount()"
                >
                    <p>Ajouter un compte externe</p>
                </button>
            </div>
            <button
                class="button mb-4"
                @click="submit()"
            >
                <p>Enregistrer</p>
            </button>
        </div>
    </div>
</template>

<script lang="js">
import SelectInput from '@/components/Input/SelectInput.vue'
import { watch } from 'vue';
import _ from 'lodash'
export default {
    components: { SelectInput },
    data() {
        return {
            user:this.$store.state.auth.user,
            roles: ['Membre','President','Secretaire','Chef de Pôle'],
            parcours: null,
            promotion: null,
            group: null,
            userClubs:null,
            socialsAccounts:null
        };
    },
    computed: {
    },

    mounted(){
        this.$store.dispatch('auth/getUser',this.user.userId )
        watch(
            () => this.$store.state.auth.me,
            (newUser) => {
                this.user = newUser
            }
        )
        this.user = this.$store.state.auth.user
        watch(
            () => this.$store.state.users.socialsAccounts,
            (newSocials) => {
                this.socialsAccounts = _.cloneDeep(newSocials)
            }
        )

        watch(
            () => this.$store.state.users.socials,
            (newSocials) => {
                this.socials = [...newSocials]
            }
        )
        watch(
            () => this.$store.state.users.userClubs,
            (newClubs) => {
                this.userClubs = [...newClubs]
            }
        )
        watch(
            () => this.$store.state.users.clubs,
            (newClubs) =>{
                this.clubs = [...newClubs]
            }
        )
        watch(
            () => this.userClubs,
            (updClubs) => {
                for(let i= 0; i<updClubs.length;i++){
                    if(Number.isInteger(updClubs[i].role)){
                        updClubs[i].role = this.roles[updClubs[i].role]
                    }
                    if(Number.isInteger(updClubs[i].club)){
                        updClubs[i].club = {clubId:this.clubs.items[updClubs[i].club].clubId}
                    }
                }
                this.userClubs = updClubs
            },
            {deep: true}
        )
        watch(
            () => this.socialsAccounts,
            (updSocial) => {
                console.log("update")
                for(let i=0;i<updSocial.length; i++){
                    if(typeof(updSocial[i].social)==="number"){
                        updSocial[i].social = {socialId:this.socials[updSocial[i].social].socialId}
                    }
                }
                if(_.isEqual(this.socialsAccounts ,updSocial)){
                    this.socialsAccounts = updSocial
                }
            },
            {deep: true}
        )

        this.$store.dispatch('users/getUserById',this.user.userId )
        this.$store.dispatch('users/getUserClubs', this.user.userId)
        this.$store.dispatch('users/getUserSocials',this.user.userId)
        this.$store.dispatch('users/getSocials')
        this.$store.dispatch('users/getClubs')
    },
    methods: {
        addLineClub: function addLineClub() {
            this.userClubs.push({role:null,club:{clubId:null}});
        },
        rmLineClub: function rmLineClub(indx) {
            this.userClubs.splice(indx,1);
        },
        addLineAccount: function addLineAccount() {
            this.socialsAccounts.push({social:{socialId:null},pseudo:null,link:null});
        },
        rmLineAccount: function rmLineAccount(indx) {
            this.socialsAccounts.splice(indx,1);
        },
        submit: function submit() {
            function canSocialBePosted(social){
                if (social.pseudo === null){
                    return false
                }
                if (social.social.socialId===null){
                    return false
                }
                return true
            }
            this.$store.dispatch('users/updateUser',this.user)

            for( let i =0; i < this.socialsAccounts.length; i++) {
                console.log(this.socialsAccounts[i])
                if(canSocialBePosted(this.socialsAccounts[i])){
                    if(!this.$store.state.users.socialsAccounts.find((a)=> _.isEqual(a,this.socialsAccounts[i]))){
                        if(this.socialsAccounts[i].socialAccountId == null){
                            this.$store.dispatch('users/addSocialAccount',{userId:this.user.userId, socialId:this.socialsAccounts[i].social.socialId,pseudo:this.socialsAccounts[i].pseudo,link:this.socialsAccounts[i].link})
                        }else{
                            if(this.socialsAccounts[i].social.socialId != this.$store.state.users.socialsAccounts.find((a) => a.socialAccountId === this.socialsAccounts[i].socialAccountId ).social.socialId){
                                this.$store.dispatch('users/replaceSocialAccount',{userId:this.user.userId, socialAccountId:this.socialsAccounts[i].socialAccountId,socialId:this.socialsAccounts[i].social.socialId,pseudo:this.socialsAccounts[i].pseudo,link:this.socialsAccounts[i].link})
                            }
                            else {
                                this.$store.dispatch('users/updateSocialAccount',{ socialAccountId:this.socialsAccounts[i].socialAccountId,pseudo:this.socialsAccounts[i].pseudo,link:this.socialsAccounts[i].link})
                            }
                        }
                    }
                }
            }
            for( let i =0; i < this.$store.state.users.socialsAccounts.length; i++){
                if(!this.socialsAccounts.find((a)=>a.socialAccountId === this.$store.state.users.socialsAccounts[i].socialAccountId)){
                    this.$store.dispatch('users/deleteSocialAccount',this.$store.state.users.socialsAccounts[i].socialAccountId)
                }
            }
        }
    }
}
</script>
