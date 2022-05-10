<template>
    <div class="p-4 sm:px-8 text-2">
        <h2 class="text-xl">Profil</h2>
        <p class="mb-6 text-sm">Vos informations personnelles publiques</p>
        <div>
            <div>
                <div class="flex mb-4">
                    <div class="flex mr-6 w-full">
                        <div class="flex flex-col mr-8 mb-4 w-fit">
                            <div class="relative mx-auto mb-2">
                                <UserAvatar
                                    :img-src="me.avatar"
                                    :username="me.firstname + ' ' + me.lastname"
                                    :size="5"
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
                                    {{ me.firstname }}
                                </div>
                                <div class="w-full uppercase whitespace-nowrap bg-1">
                                    {{ me.lastname }}
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col w-full">
                            <label for="description" class="text-lg">Description</label>
                            <textarea
                                v-model="me.description"
                                name="description"
                                class="resize-none input"
                                rows="5"
                            />
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

<script setup>
    // import { blagues } from '@/assets/blagues/blagues'
    // import AppLoader from '@/components/App/AppLoader.vue'
    // import SelectInput from '@/components/Input/SelectInput.vue'
    import { blagues } from '@/assets/blagues/blagues'
    import AvatarCropper from '@/components/User/AvatarCropper/AvatarCropper.vue'
    import UserAvatar from '@/components/User/UserAvatar.vue'
    import { emitter } from '@/shared/modules/emitter'
    import { useAuthStore } from '@/store/auth.store'
    import { useProfilesStore } from '@/store/profile.store'
    import { getStatus } from '@/utils/errors'
    import { ref } from 'vue'

    // import _ from 'lodash';
    // import { watch } from 'vue';

    // const socialAccounts = []
    const apiUrl = import.meta.env.VITE_API_URL
    const auth = useAuthStore()
    const profile = useProfilesStore()
    const me = ref(null)
    let submitSuccess = 0
    let avatarShown = ref(false)
    let submitMessage = ''

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
    const showImage = () => {
        avatarShown.value = !avatarShown.value
    }
    const cropUploadSuccess = (jsonData) => {
        console.log(jsonData.profileImageId)
    }

    const getJoke = () => {
        const blague = blagues[Math.floor(Math.random() * blagues.length)]
        return blague.question + '\n' + blague.answer
    }
    const submit = async () => {
        await profile
            .patchUser({
                description: me.value.description !== '' ? me.value.description : getJoke(),
            })
            .then((res) => (me.value = res))
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
        console.log('submited')
    }

    await loadMe()
    // export default {
    //     computed: {
    //         user() {
    //             return this.$store.state.auth.user
    //         },
    //         userClubs() {
    //             return this.$store.state.user.clubs
    //         },
    //         // socialAccounts() {
    //         //     return this.$store.state.user.socialAccounts
    //         // },
    //         socials() {
    //             return this.$store.state.user.enumSocials
    //         },
    //     },

    //     mounted() {
    //         if (this.user != null && this.user != undefined) {
    //             this.$store.dispatch('user/getProfile')
    //         }
    //     },
    //     methods: {
    //
    //         submit: function submit() {
    //             // TODO: entire refactor using Vuelidate
    //             // function canSocialBePosted(social) {
    //             //     if (social.pseudo === null) {
    //             //         return false
    //             //     }
    //             //     if (social.social.socialId===null) {
    //             //         return false
    //             //     }
    //             //     return true
    //             // }
    //             // this.submitMessage = 'Enregistré'
    //             // this.submitSuccess = 1
    //             // if (this.user.description ==='' || this.user.description === null || this.user.description === undefined) {
    //             //     const blague = blagues[Math.floor(Math.random()*blagues.length)]
    //             //     this.user.description = `${blague.question}\n${blague.answer}`
    //             //     this.submitMessage = 'Nous vous avons ajouté une blague en description :)'
    //             // }
    //             // this.$store.dispatch('users/updateUser',this.user).then().catch(() => {
    //             //     this.submitSuccess = -1
    //             // })
    //             // for ( let i =0; i < this.socialAccounts.length; i++) {
    //             //     if (canSocialBePosted(this.socialAccounts[i])) {
    //             //         if (!this.$store.state.profiles.currentUser.socialAccounts.find((a) => _.isEqual(a,this.socialAccounts[i]))) {
    //             //             if (this.socialAccounts[i].socialAccountId == null) {
    //             //                 this.$store.dispatch('users/addSocialAccount',{
    //             //                     userId: this.user.userId,
    //             //                     socialId: this.socialAccounts[i].social.socialId,
    //             //                     pseudo: this.socialAccounts[i].pseudo,
    //             //                     link: this.socialAccounts[i].link,
    //             //                 }).then().catch(() => {
    //             //                     this.submitSuccess = -1
    //             //                     this.submitMessage = "Erreur lors de l'ajout du compte"
    //             //                 })
    //             //             } else {
    //             //                 if (this.socialAccounts[i].social.socialId != this.$store.state.profiles.currentUser.socialAccounts.find((a) => a.socialAccountId === this.socialAccounts[i].socialAccountId ).social.socialId) {
    //             //                     this.$store.dispatch('users/replaceSocialAccount',{
    //             //                         userId: this.user.userId,
    //             //                         socialAccountId: this.socialAccounts[i].socialAccountId,
    //             //                         socialId: this.socialAccounts[i].social.socialId,
    //             //                         pseudo: this.socialAccounts[i].pseudo,
    //             //                         link: this.socialAccounts[i].link,
    //             //                     }).then().catch(() => {
    //             //                         this.submitSuccess = -1
    //             //                         this.submitMessage = 'Erreur lors du changement du type de compte'
    //             //                     })
    //             //                 }
    //             //                 else {
    //             //                     this.$store.dispatch('users/updateSocialAccount',{
    //             //                         socialAccountId: this.socialAccounts[i].socialAccountId,
    //             //                         pseudo: this.socialAccounts[i].pseudo,
    //             //                         link: this.socialAccounts[i].link,
    //             //                     }).then().catch(() => {
    //             //                         this.submitSuccess = -1
    //             //                         this.submitMessage = 'Erreur lors de la modification du compte'
    //             //                     })
    //             //                 }
    //             //             }
    //             //         }
    //             //     }
    //             // }
    //             // for ( let i =0; i < this.$store.state.profiles.currentUser.socialAccounts.length; i++) {
    //             //     if (!this.socialAccounts.find((a) => a.socialAccountId === this.$store.state.profiles.currentUser.socialAccounts[i].socialAccountId)) {
    //             //         this.$store.dispatch('users/deleteSocialAccount',this.$store.state.profiles.currentUser.socialAccounts[i].socialAccountId).then().catch(
    //             //             this.submitSuccess = -1,
    //             //         )
    //             //     }
    //             // }
    //         },
    //     },
    // }
</script>
