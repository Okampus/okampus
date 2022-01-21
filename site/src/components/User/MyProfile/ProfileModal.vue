<template>
    <div
        v-if=" clubs === undefined || clubs === null || socials === undefined || socials === null || userClubs === undefined || userClubs === null "
        class="relative h-32"
    >
        <AppLoader
            :class="$store.state.users"
        />
    </div>
    <div
        v-else
        class="px-4 sm:px-8 py-4 text-2"
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
                    <div class="flex mr-6 w-full">
                        <div class="flex flex-col w-fit mr-8 mb-4">
                            <div class="relative mx-auto mb-2">
                                <avatar-image
                                    :src="user.avatar"
                                    :alt="user.username + ' profile image'"
                                    :size="32"
                                />
                                <button
                                    class="absolute md:block hidden bottom-0 left-24 "
                                    @click="showImage()"
                                >
                                    <font-awesome-icon
                                        icon="camera"
                                        class="text-lg absolute bottom-0 rounded-full border px-1 bg-2 border-color-2"
                                    />
                                </button>
                            </div>
                            <div class="flex mx-auto justify-between">
                                <div
                                    class="w-full bg-1 mr-2 capitalize whitespace-nowrap"
                                >
                                    {{ user.username }}
                                </div>
                                <div
                                    class="w-full bg-1 uppercase whitespace-nowrap"
                                >
                                    {{ user.username }}
                                </div>
                            </div>
                        </div>
                        <div class="flex w-full flex-col">
                            <label
                                for="description"
                                class="text-lg"
                            >Description</label>
                            <textarea
                                v-model="user.description"
                                name="description"
                                class="input resize-none"
                                rows="5"
                            />
                        </div>
                    </div>
                </div>
                <div class="mb-4 ">
                    <div class="flex">
                        <div class="text-lg">
                            Comptes Externes
                        </div>
                        <button
                            class="text-blue-500 ml-4 text-sm flex my-auto"
                            @click="addLineAccount()"
                        >
                            <font-awesome-icon
                                icon="plus"
                            />
                            <div>
                                Ajouter un compte
                            </div>
                        </button>
                    </div>
                    <div v-if="socialsAccounts.length === 0">
                        Vous n'avez pas encore lié de compte externe
                    </div>

                    <div class="flex">
                        <div class="flex flex-col">
                            <div
                                v-for="(social, idx) in socialsAccounts"
                                :key="idx"
                                class="flex lg:mb-2 items-center mb-8"
                            >
                                <div class=" ">
                                    <div class="flex">
                                        <i
                                            v-if="social.social.socialId!=null"
                                            class="mr-2 my-auto"
                                            :class="socials.find((a)=> a.socialId === social.social.socialId).icon"
                                        />
                                        <SelectInput
                                            v-model="social.social"

                                            :max-content-width="true"
                                            :choices="socials.map(sos=> sos.name)"
                                            :model-value="socials.indexOf(socials.find((a)=> a.socialId === social.social.socialId))"
                                        />
                                        <button
                                            class="text-1 block lg:hidden text-xl my-auto red-500 h-8 w-8 "
                                            @click="rmLineAccount(idx)"
                                        >
                                            <font-awesome-icon
                                                icon="times"
                                            />
                                        </button>
                                    </div>
                                    <div class="flex flex-col lg:hidden">
                                        <input
                                            v-model="social.pseudo"
                                            class="input mt-2"
                                            placeholder="Pseudo"
                                        >
                                        <input
                                            v-model="social.link"
                                            class="input mt-2"
                                            placeholder="Lien"
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="hidden lg:flex flex-col">
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
                        <div class="hidden lg:flex flex-col">
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
                                        <font-awesome-icon
                                            icon="times"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex mb-4 mt-16">
                <button
                    class="button my-auto"
                    @click="submit()"
                >
                    <div>
                        <p class="px-5">
                            Enregistrer
                        </p>
                    </div>
                </button>
                <div
                    v-if="submitSuccess===1"
                    class="text-green-500 bg-green-500 bg-opacity-25 font-bold p-2 rounded-md my-auto ml-4 flex gap-2"
                >
                    <font-awesome-icon
                        icon="check"
                        class="my-auto"
                    />
                    <div class="my-auto">
                        {{ submitMessage }}
                    </div>
                </div>
                <div
                    v-else-if="submitSuccess===-1"
                    class="text-red-500 bg-red-500 bg-opacity-25 font-bold p-2 rounded-md my-auto ml-4 flex gap-2"
                >
                    <font-awesome-icon
                        icon="times"
                        class="my-auto"
                    />
                    <div class="my-auto">
                        {{ submitMessage }}
                    </div>
                </div>
            </div>
            <AvatarCropper
                v-model="avatarShown"
                field="file"
                img-format="jpg"
                :url="`${API_URL}files/profile-images`"
                lang-type="fr"
                :with-credentials="true"
                @crop-upload-success="cropUploadSuccess"
            />
        </div>
    </div>
</template>

<script lang="js">

import default_avatar from '@/assets/img/default_avatars/user.png'

import _ from 'lodash'
import { watch } from 'vue';

import SelectInput from '@/components/Input/SelectInput.vue'
import AvatarImage from '@/components/User/UserAvatar.vue';
import AppLoader from '@/components/App/AppLoader.vue';
import AvatarCropper from '@/components/User/AvatarCropper/AvatarCropper.vue';
import { blagues } from '@/assets/blagues/blagues';

export default {
    components: {
        SelectInput,
        AvatarImage,
        AppLoader,
        AvatarCropper
    },
    data() {
        return {
            user:this.$store.state.auth.user,
            submitSuccess: 0,
            userClubs:null,
            socialsAccounts:null,
            default_avatar:default_avatar,
            avatarShown: false,
            API_URL: `${import.meta.env.VITE_API_URL}/`,
            blagues: blagues,
            submitMessage: ""
        };
    },
    computed: {
    },

    mounted(){
        if(this.user != null && this.user != undefined){
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
        }else {
            this.$router.push("/")
        }
    },
    methods: {
        showImage: function showImage() {
            if(this.avatarShown){
                this.avatarShown = false
            }else{
                this.avatarShown = true
            }
        },
        cropUploadSuccess: function cropUploadSuccess(jsonData){
            console.log(jsonData.profileImageId);
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
            this.submitMessage = "Enregistré"
            this.submitSuccess = 1

            if (this.user.description ==='' || this.user.description === null || this.user.description === undefined){
                const blague = blagues[Math.floor(Math.random()*blagues.length)]
                this.user.description = `${blague.question}\n${blague.answer}`
                this.submitMessage = "Nous vous avons ajouté une blague en description :)"
            }

            this.$store.dispatch('users/updateUser',this.user).then().catch(() => {
                console.log("updateUser")
                this.submitSuccess = -1
            })

            for( let i =0; i < this.socialsAccounts.length; i++) {
                if(canSocialBePosted(this.socialsAccounts[i])){
                    if(!this.$store.state.users.socialsAccounts.find((a)=> _.isEqual(a,this.socialsAccounts[i]))){
                        if(this.socialsAccounts[i].socialAccountId == null){
                            this.$store.dispatch('users/addSocialAccount',{userId:this.user.userId, socialId:this.socialsAccounts[i].social.socialId,pseudo:this.socialsAccounts[i].pseudo,link:this.socialsAccounts[i].link}).then().catch(() =>{
                                this.submitSuccess = -1
                                this.submitMessage = "Erreur lors de l'ajout du compte"
                            })
                        }else{
                            if(this.socialsAccounts[i].social.socialId != this.$store.state.users.socialsAccounts.find((a) => a.socialAccountId === this.socialsAccounts[i].socialAccountId ).social.socialId){
                                this.$store.dispatch('users/replaceSocialAccount',{userId:this.user.userId, socialAccountId:this.socialsAccounts[i].socialAccountId,socialId:this.socialsAccounts[i].social.socialId,pseudo:this.socialsAccounts[i].pseudo,link:this.socialsAccounts[i].link}).then().catch(() =>{
                                    this.submitSuccess = -1
                                    this.submitMessage = "Erreur lors du changement du type de compte"
                                })
                            }
                            else {
                                this.$store.dispatch('users/updateSocialAccount',{ socialAccountId:this.socialsAccounts[i].socialAccountId,pseudo:this.socialsAccounts[i].pseudo,link:this.socialsAccounts[i].link}).then().catch(() =>{
                                    this.submitSuccess = -1
                                    this.submitMessage = "Erreur lors de la modification du compte"
                                })
                            }
                        }
                    }
                }
            }
            for( let i =0; i < this.$store.state.users.socialsAccounts.length; i++){
                if(!this.socialsAccounts.find((a)=>a.socialAccountId === this.$store.state.users.socialsAccounts[i].socialAccountId)){
                    this.$store.dispatch('users/deleteSocialAccount',this.$store.state.users.socialsAccounts[i].socialAccountId).then().catch(
                        this.submitSuccess = -1
                    )
                }
            }
        }
    }
}
</script>
