<template>
    <div>
        <div class="text-2 bg-2 flex flex-col rounded-xl pb-4 shadow-md">
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
                    class="h-36 w-full rounded-t-lg"
                    :banner="club.banner"
                    :name="club.name"
                    :data="club.category"
                />
                <div
                    v-if="!club.banner"
                    class="absolute inset-0 m-auto flex flex-col items-center justify-center text-center text-white"
                >
                    <div class="text-2xl font-semibold">{{ club.name }} n'a pas de bannière !</div>
                    <div>Ajoutez une bannière pour présenter {{ club.name }}.</div>
                </div>
                <div
                    class="absolute top-5 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white"
                >
                    <i
                        class="fa text-xl text-blue-500"
                        :class="club.banner ? 'fa-pen' : 'fa-plus'"
                        @click="editingBanner = true"
                    />
                </div>
            </div>
            <div class="flex">
                <div class="bg-2 z-10 -mt-[3.5rem] ml-4 w-fit rounded-2xl p-1">
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
                <div class="flex w-full items-start justify-between">
                    <button
                        class="button-grey fa fa-camera mt-2 ml-2 flex h-8 w-8 items-center justify-center rounded-full text-lg"
                        @click="editingAvatar = true"
                    />
                    <ModalPopup :show="editingPage" @close="editingPage = false">
                        <template #default="{ close }">
                            <div class="card flex flex-col items-center justify-center py-8 px-10">
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
                                <div class="mt-6 flex gap-4 self-end">
                                    <button class="button-grey" @click="close">Annuler</button>
                                    <button
                                        class="button-blue"
                                        @click="
                                            () => {
                                                updateClubForm.node.submit()
                                                close()
                                            }
                                        "
                                    >
                                        Valider
                                    </button>
                                </div>
                            </div>
                        </template>
                    </ModalPopup>
                    <div class="button-grey mt-2 mr-4 text-base" @click="editingPage = true">Modifier</div>
                </div>
            </div>
            <div class="ml-4 flex grow flex-col">
                <div class="flex justify-between">
                    <div class="text-0 mt-1 text-2xl font-semibold">{{ club.name }}</div>
                </div>
                <div class="text-2 mt-1">{{ club.shortDescription }}</div>
            </div>
        </div>
        <div class="text-2 bg-2 mt-4 flex flex-col gap-5 rounded-xl p-4 shadow-md">
            <div>
                <div class="mb-2 text-lg font-semibold">Catégorie de l'association</div>
                <router-link :to="`/clubs/${clubTypes[club.category].link}`">
                    <LabelSimple class="bg-slate-600/40 hover:bg-slate-400/40">{{
                        club.category
                    }}</LabelSimple>
                </router-link>
            </div>
            <div>
                <div class="mb-2 text-lg font-semibold">Description de l'association</div>
                <div class="text-2">{{ club.longDescription }}</div>
            </div>
        </div>
        <div class="text-2 bg-2 mt-4 flex flex-col gap-5 rounded-xl p-4 shadow-xl">
            <div>
                <div class="text-lg font-semibold">Formulaire d'inscription</div>
                <p>
                    Vous pouvez décider de modifier le formulaire nécessaire à la demande pour rejoindre votre
                    association
                </p>
            </div>
            <FormList :club-id="club.teamId" @submit="(formId) => changeForm(formId)"></FormList>
        </div>
    </div>
</template>

<script setup>
    import AvatarCropper from 'vue-avatar-cropper'
    import ProfileBanner from '../ProfileBanner.vue'
    import ProfileAvatar from '../ProfileAvatar.vue'
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'
    import FormList from '@/components/FormKit/FormList.vue'

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

    const changeForm = async (formId) => {
        await clubs.patchClub(props.club.teamId, { membershipRequestFormId: formId })
    }

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
