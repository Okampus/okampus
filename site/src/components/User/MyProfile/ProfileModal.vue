<template>
    <div v-if="userClubs === undefined || userClubs === null" class="relative h-32">
        <AppLoader />
    </div>
    <div v-else class="p-4 sm:px-8 text-2">
        <h2 class="text-xl">Profil</h2>
        <p class="mb-6 text-sm">Vos informations personnelles publiques</p>
        <div>
            <div>
                <div class="flex mb-4">
                    <div class="flex mr-6 w-full">
                        <div class="flex flex-col mr-8 mb-4 w-fit">
                            <div class="relative mx-auto mb-2">
                                <AvatarImage
                                    :src="user.avatar"
                                    :alt="user.fullname + ' profile image'"
                                    :size="32"
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
                                    {{ user.fullname }}
                                </div>
                                <div class="w-full uppercase whitespace-nowrap bg-1">
                                    {{ user.fullname }}
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col w-full">
                            <label for="description" class="text-lg">Description</label>
                            <textarea
                                v-model="user.description"
                                name="description"
                                class="resize-none input"
                                rows="5"
                            />
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <div class="flex">
                        <div class="text-lg">Comptes Externes</div>
                        <button class="flex my-auto ml-4 text-sm text-blue-500" @click="addLineAccount()">
                            <font-awesome-icon icon="plus" />
                            <div>Ajouter un compte</div>
                        </button>
                    </div>
                    <div v-if="socialAccounts === null || socialAccounts.length === 0">
                        Vous n'avez pas encore lié de compte externe
                    </div>

                    <div class="flex">
                        <div class="flex flex-col">
                            <div
                                v-for="(account, idx) in socialAccounts"
                                :key="idx"
                                class="flex items-center mb-8 lg:mb-2"
                            >
                                <div class="flex">
                                    {{ account }}
                                    <i
                                        v-if="account.socialId != null"
                                        class="my-auto mr-2"
                                        :class="
                                            socials.find(
                                                (social) => social.socialId === account.social?.socialId,
                                            ).icon
                                        "
                                    />
                                    <SelectInput
                                        v-model="account.social"
                                        :max-content-width="true"
                                        :choices="socials.map((sos) => sos.name)"
                                    />
                                    <button
                                        class="block my-auto w-8 h-8 text-xl lg:hidden text-1 red-500"
                                        @click="rmLineAccount(idx)"
                                    >
                                        <font-awesome-icon icon="times" />
                                    </button>
                                </div>
                                <div class="flex flex-col lg:hidden">
                                    <input v-model="account.pseudo" class="mt-2 input" placeholder="Pseudo" />
                                    <input v-model="account.link" class="mt-2 input" placeholder="Lien" />
                                </div>
                            </div>
                        </div>
                        <div class="hidden flex-col lg:flex">
                            <div
                                v-for="(social, idx) in socialAccounts"
                                :key="idx"
                                class="flex items-center mb-2"
                            >
                                <input v-model="social.pseudo" class="ml-2 input" placeholder="Pseudo" />
                            </div>
                        </div>
                        <div class="hidden flex-col lg:flex">
                            <div
                                v-for="(social, idx) in socialAccounts"
                                :key="idx"
                                class="flex items-center mb-2"
                            >
                                <div class="">
                                    <input v-model="social.link" class="ml-2 input" placeholder="Lien" />
                                    <button
                                        class="w-8 h-8 text-xl text-1 red-500"
                                        @click="rmLineAccount(idx)"
                                    >
                                        <font-awesome-icon icon="times" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex mt-16 mb-4">
                <button class="my-auto button" @click="submit()">
                    <div>
                        <p class="px-5">Enregistrer</p>
                    </div>
                </button>
                <div
                    v-if="submitSuccess === 1"
                    class="flex gap-2 p-2 my-auto ml-4 font-bold text-green-600 bg-green-500 rounded-md bg-opacity-/25"
                >
                    <font-awesome-icon icon="check" class="my-auto" />
                    <div class="my-auto">
                        {{ submitMessage }}
                    </div>
                </div>
                <div
                    v-else-if="submitSuccess === -1"
                    class="flex gap-2 p-2 my-auto ml-4 font-bold text-red-500 bg-red-500 rounded-md bg-opacity-/25"
                >
                    <font-awesome-icon icon="times" class="my-auto" />
                    <div class="my-auto">
                        {{ submitMessage }}
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
        </div>
    </div>
</template>

<script>
    import { blagues } from '@/assets/blagues/blagues'
    import defaultAvatar from '@/assets/img/default_avatars/user.png'
    import AppLoader from '@/components/App/AppLoader.vue'
    import SelectInput from '@/components/Input/SelectInput.vue'
    import AvatarCropper from '@/components/User/AvatarCropper/AvatarCropper.vue'
    import AvatarImage from '@/components/User/UserAvatar.vue'
    // import _ from 'lodash';
    // import { watch } from 'vue';

    export default {
        components: {
            SelectInput,
            AvatarImage,
            AppLoader,
            AvatarCropper,
        },
        data() {
            return {
                apiUrl: import.meta.env.VITE_API_URL,
                defaultAvatar,
                socialAccounts: [],
                submitSuccess: 0,
                avatarShown: false,
                blagues: blagues,
                submitMessage: '',
            }
        },
        computed: {
            user() {
                return this.$store.state.auth.user
            },
            userClubs() {
                return this.$store.state.user.clubs
            },
            // socialAccounts() {
            //     return this.$store.state.user.socialAccounts
            // },
            socials() {
                return this.$store.state.user.enumSocials
            },
        },

        mounted() {
            if (this.user != null && this.user != undefined) {
                this.$store.dispatch('user/getProfile')
            }
        },
        methods: {
            showImage: function showImage() {
                if (this.avatarShown) {
                    this.avatarShown = false
                } else {
                    this.avatarShown = true
                }
            },
            cropUploadSuccess: function cropUploadSuccess(jsonData) {
                console.log(jsonData.profileImageId)
            },
            addLineAccount() {
                this.socialAccounts.push({
                    social: { socialId: null },
                    pseudo: null,
                    link: null,
                })
            },
            rmLineAccount: function rmLineAccount(indx) {
                this.socialAccounts.splice(indx, 1)
            },
            submit: function submit() {
                // TODO: entire refactor using Vuelidate
                // function canSocialBePosted(social) {
                //     if (social.pseudo === null) {
                //         return false
                //     }
                //     if (social.social.socialId===null) {
                //         return false
                //     }
                //     return true
                // }
                // this.submitMessage = 'Enregistré'
                // this.submitSuccess = 1
                // if (this.user.description ==='' || this.user.description === null || this.user.description === undefined) {
                //     const blague = blagues[Math.floor(Math.random()*blagues.length)]
                //     this.user.description = `${blague.question}\n${blague.answer}`
                //     this.submitMessage = 'Nous vous avons ajouté une blague en description :)'
                // }
                // this.$store.dispatch('users/updateUser',this.user).then().catch(() => {
                //     this.submitSuccess = -1
                // })
                // for ( let i =0; i < this.socialAccounts.length; i++) {
                //     if (canSocialBePosted(this.socialAccounts[i])) {
                //         if (!this.$store.state.profiles.currentUser.socialAccounts.find((a) => _.isEqual(a,this.socialAccounts[i]))) {
                //             if (this.socialAccounts[i].socialAccountId == null) {
                //                 this.$store.dispatch('users/addSocialAccount',{
                //                     userId: this.user.userId,
                //                     socialId: this.socialAccounts[i].social.socialId,
                //                     pseudo: this.socialAccounts[i].pseudo,
                //                     link: this.socialAccounts[i].link,
                //                 }).then().catch(() => {
                //                     this.submitSuccess = -1
                //                     this.submitMessage = "Erreur lors de l'ajout du compte"
                //                 })
                //             } else {
                //                 if (this.socialAccounts[i].social.socialId != this.$store.state.profiles.currentUser.socialAccounts.find((a) => a.socialAccountId === this.socialAccounts[i].socialAccountId ).social.socialId) {
                //                     this.$store.dispatch('users/replaceSocialAccount',{
                //                         userId: this.user.userId,
                //                         socialAccountId: this.socialAccounts[i].socialAccountId,
                //                         socialId: this.socialAccounts[i].social.socialId,
                //                         pseudo: this.socialAccounts[i].pseudo,
                //                         link: this.socialAccounts[i].link,
                //                     }).then().catch(() => {
                //                         this.submitSuccess = -1
                //                         this.submitMessage = 'Erreur lors du changement du type de compte'
                //                     })
                //                 }
                //                 else {
                //                     this.$store.dispatch('users/updateSocialAccount',{
                //                         socialAccountId: this.socialAccounts[i].socialAccountId,
                //                         pseudo: this.socialAccounts[i].pseudo,
                //                         link: this.socialAccounts[i].link,
                //                     }).then().catch(() => {
                //                         this.submitSuccess = -1
                //                         this.submitMessage = 'Erreur lors de la modification du compte'
                //                     })
                //                 }
                //             }
                //         }
                //     }
                // }
                // for ( let i =0; i < this.$store.state.profiles.currentUser.socialAccounts.length; i++) {
                //     if (!this.socialAccounts.find((a) => a.socialAccountId === this.$store.state.profiles.currentUser.socialAccounts[i].socialAccountId)) {
                //         this.$store.dispatch('users/deleteSocialAccount',this.$store.state.profiles.currentUser.socialAccounts[i].socialAccountId).then().catch(
                //             this.submitSuccess = -1,
                //         )
                //     }
                // }
            },
        },
    }
</script>
