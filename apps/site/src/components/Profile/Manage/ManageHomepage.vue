<template>
    <div class="flex flex-col pb-4 rounded-xl shadow-xl text-2 bg-2">
        <div class="relative">
            <AvatarCropper
                v-model="editingBanner"
                :upload-url="uploadTypeUrl('banner')"
                :request-options="{ method: 'PUT', credentials: 'include' }"
                :output-options="{ width: 990, height: 130 }"
                :cropper-options="{ aspectRatio: 9.9 / 1.3, zoomable: true, movable: true }"
                :labels="{ submit: 'Valider', cancel: 'Annuler' }"
                @error="onUploadFailure"
                @completed="(res) => onUploadSuccess(res, 'banner')"
            />
            <ProfileBanner
                class="w-full h-36 rounded-t-lg"
                :banner="club.banner"
                :name="club.name"
                :data="club.category"
            />
            <div
                v-if="!club.banner"
                class="flex absolute inset-0 flex-col justify-center items-center m-auto text-center text-white"
            >
                <div class="text-2xl font-semibold">Votre association n'a pas de bannière !</div>
                <div>Ajoutez une bannière pour présenter votre association.</div>
            </div>
            <div
                class="flex absolute top-5 right-5 justify-center items-center w-10 h-10 bg-white rounded-full cursor-pointer"
            >
                <i
                    class="text-xl text-blue-500 fa"
                    :class="club.banner ? 'fa-pen' : 'fa-plus'"
                    @click="editingBanner = true"
                />
            </div>
        </div>
        <div class="flex">
            <div class="z-10 p-1 -mt-[3.5rem] ml-4 w-fit rounded-2xl bg-2">
                <AvatarCropper
                    v-model="editingAvatar"
                    :upload-url="uploadTypeUrl('avatar')"
                    :request-options="{ method: 'PUT', credentials: 'include' }"
                    :cropper-options="{ aspectRatio: 1, zoomable: true, movable: true }"
                    :labels="{ submit: 'Valider', cancel: 'Annuler' }"
                    upload-file-name="image.png"
                    @error="onUploadFailure"
                    @completed="(res) => onUploadSuccess(res, 'avatar')"
                />
                <ProfileAvatar :rounded-full="false" :avatar="club.avatar" :size="6" :name="club.name" />
            </div>

            <i
                class="flex justify-center items-center mt-1 ml-1 w-10 h-10 text-xl rounded-full border-2 border-2-light dark:border-2-dark button-grey fa fa-camera"
                @click="editingAvatar = true"
            />
        </div>
        <div class="flex flex-col grow ml-4">
            <div class="flex justify-between">
                <div class="mt-1 text-2xl font-semibold text-0">{{ club.name }}</div>

                <ModalPopup :show="editingPage" @close="editingPage = false">
                    <template #default="{ close }">
                        <div class="flex flex-col justify-center items-center py-8 px-10 card">
                            <div class="text-2xl">Modification des informations de l'association</div>
                            <FormKit
                                id="update-club-data"
                                ref="updateClubForm"
                                v-model="clubData"
                                :actions="false"
                                form-class="flex flex-col mt-6 w-full max-w-xl"
                                type="form"
                                @submit="updateClubData"
                            >
                                <FormKit
                                    type="text"
                                    name="shortDescription"
                                    label="Description courte"
                                    help="Description de l'association présente sous le nom"
                                />
                                <FormKit
                                    type="textarea"
                                    name="longDescription"
                                    label="Description longue"
                                    rows="6"
                                    help="Description longue de l'association"
                                />
                            </FormKit>
                            <div class="flex gap-4 self-end mt-6">
                                <div class="button-cancel" @click="close">Annuler</div>
                                <div
                                    class="button-submit with-shadow"
                                    @click="
                                        () => {
                                            updateClubForm.node.submit()
                                            close()
                                        }
                                    "
                                >
                                    Valider
                                </div>
                            </div>
                        </div>
                    </template>
                </ModalPopup>

                <div class="-mt-5 mr-4 mb-3 text-xl button-submit" @click="editingPage = true">Modifier</div>
            </div>
            <div class="mt-1 text-2">{{ club.shortDescription }}</div>
        </div>
    </div>
    <div class="flex flex-col gap-5 p-4 mt-4 rounded-xl shadow-xl text-2  bg-2">
        <div>
            <div class="mb-2 text-lg font-semibold">Catégorie de l'association</div>
            <router-link :to="`/clubs/${clubTypes[club.category].link}`">
                <LabelSimple class="bg-slate-600/40 hover:bg-slate-400/40">{{ club.category }}</LabelSimple>
            </router-link>
        </div>
        <div>
            <div class="mb-2 text-lg font-semibold">Description de l'association</div>
            <div class="text-2">{{ club.longDescription }}</div>
        </div>
    </div>
</template>

<script setup>
    import AvatarCropper from 'vue-avatar-cropper'
    import ProfileBanner from '../ProfileBanner.vue'
    import ProfileAvatar from '../ProfileAvatar.vue'
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'

    import { clubTypes } from '@/shared/types/club-types.enum'
    import { useClubsStore } from '@/store/clubs.store'
    import { emitter } from '@/shared/modules/emitter'
    import { ref } from 'vue'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const emit = defineEmits(['update:club'])

    const clubs = useClubsStore()
    const clubData = ref({
        shortDescription: ref(props.club.shortDescription),
        longDescription: ref(props.club.longDescription),
    })

    const updateClubForm = ref(null)

    const updateClubData = async (data) => {
        await clubs
            .patchClub(props.club.teamId, data)
            .then((newClub) => {
                emit('update:club', newClub)
                emitter.emit('show-toast', {
                    message: "Les informations de l'association ont bien été mises à jour.",
                    type: 'success',
                })
            })
            .catch((err) => {
                console.log('Error', err)
                emitter.emit('show-toast', {
                    message: `Erreur: ${JSON.stringify(err)}`,
                    type: 'error',
                })
            })
    }

    const uploadTypeUrl = (type) => `${import.meta.env.VITE_API_URL}/teams/teams/${props.club.teamId}/${type}`

    const editingPage = ref(false)
    const editingAvatar = ref(false)
    const editingBanner = ref(false)

    const name = {
        banner: { name: 'Bannière', frFeminine: true },
        avatar: { name: 'Avatar', frFeminine: false },
    }

    const onUploadFailure = (err) => {
        if (!err?.context?.response) {
            emitter.emit('show-toast', {
                message: `Erreur: ${err.message}`,
                type: 'failure',
            })
        }
    }

    const onUploadSuccess = (res, type) => {
        if (res?.response?.status === 200) {
            res.response.json().then((club) => {
                clubs.replaceClub(club)
                emit('update:club', club)
            })

            emitter.emit('show-toast', {
                message: `${name[type].name} mis${name[type].frFeminine ? 'e' : ''} à jour.`,
                type: 'success',
            })
        } else {
            emitter.emit('show-toast', {
                message: `Erreur: ${res?.response?.statusText ?? 'Erreur inconnue'}`,
                type: 'failure',
            })
        }
    }
</script>
