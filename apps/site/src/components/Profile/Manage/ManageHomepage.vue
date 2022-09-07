<template>
    <div class="flex flex-col gap-4">
        <FormPopUp
            v-model:show="showUpdateClubForm"
            :form-schema="updateClubFormSchema"
            :submit="
                (team) => {
                    updateClub({ id: club.id, team })
                }
            "
        />

        <div class="card-2 px-0 pt-0">
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
                    :rounded-top="md"
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

            <div class="flex justify-between">
                <div class="bg-2 relative z-10 -mt-[3rem] ml-4 w-fit rounded-2xl p-1">
                    <ModifiableAvatar
                        :entity="club"
                        entity-type="team"
                        :size="6"
                        :avatar-props="{ roundedFull: false }"
                    />
                </div>
                <button
                    class="button-blue mt-4 mr-4 flex items-center gap-3 text-base"
                    @click="showUpdateClubForm = true"
                >
                    <i class="fa fa-pencil" /> Modifier la page
                </button>
            </div>

            <div class="mt-4 ml-4 flex flex-col">
                <div class="text-0 text-2xl font-semibold">{{ club.name }}</div>
                <div class="text-2 mt-1">{{ club.shortDescription }}</div>
            </div>
        </div>

        <div class="card-2 flex flex-col gap-8">
            <!-- <div class="w-fit">
                <div class="mb-2 text-lg font-semibold">Catégorie de l'association</div>
                <router-link :to="`/clubs/${clubTypes[club.category].link}`">
                    <LabelSimple class="bg-slate-600/40 hover:bg-slate-400/40">{{
                        club.category
                    }}</LabelSimple>
                </router-link>
            </div> -->
            <div>
                <div class="mb-2 text-lg font-semibold">Description de l'association</div>
                <div class="text-2">{{ club.longDescription }}</div>
            </div>
            <div class="flex items-center text-lg font-semibold">
                Formulaire d'adhésion
                <InfoIcon
                    tooltip="Changez le formulaire d'adhésion visible sur la liste des associations !"
                />
            </div>
            <FormList
                :model-value="club.membershipRequestForm"
                :forms="club.forms"
                :form-type="MEMBERSHIP_REQUEST"
                :team-id="club.id"
                :select="true"
                :default-form="{
                    id: null,
                    type: MEMBERSHIP_REQUEST,
                    name: 'Adhésion simple',
                    schema: DEFAULT_JOIN_FORM_SCHEMA,
                }"
                @update:model-value="
                    updateClub({ id: club.id, team: { membershipRequestFormId: $event?.id ?? null } })
                "
                @submit="(formId) => changeForm(formId)"
            />
        </div>
    </div>
</template>

<script setup>
    import AvatarCropper from 'vue-avatar-cropper'
    import FormPopUp from '@/components/Form/FormPopUp.vue'
    import FormList from '@/components/FormKit/FormList.vue'

    import ModifiableAvatar from '@/components/Profile/ModifiableAvatar.vue'
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    // import LabelSimple from '@/components/UI/Label/LabelSimple.vue'

    import InfoIcon from '@/icons/InfoIcon.vue'

    // import { clubTypes } from '@/shared/types/club-types.enum'
    import { emitter } from '@/shared/modules/emitter'
    import { ref } from 'vue'

    import { useBreakpoints } from '@vueuse/core'
    import { updateTeam } from '@/graphql/queries/teams/updateTeam'
    import { useMutation } from '@vue/apollo-composable'

    import { MEMBERSHIP_REQUEST } from '@/shared/types/team-form-types.enum'
    import { DEFAULT_JOIN_FORM_SCHEMA } from '@/shared/assets/form-schemas/default-schemas'
    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast'

    import { twBreakpoints } from '@/tailwind'

    const breakpoints = useBreakpoints(twBreakpoints)
    const md = breakpoints.greater('md')

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const emit = defineEmits(['update:club'])

    const { mutate: updateClub, onError, onDone } = useMutation(updateTeam)
    onError(showToastGraphQLError)
    onDone(() => {
        showSuccessToast("Formulaire d'adhésion mis à jour 📋")
        showUpdateClubForm.value = false
    })

    const showUpdateClubForm = ref(false)
    const updateClubFormSchema = [
        {
            $el: 'h1',
            children: ["Modification des informations de l'association 📝"],
        },
        {
            $formkit: 'text',
            name: 'shortDescription',
            label: 'Description courte',
            help: "Description accompagnant le nom de l'association",
            value: props.club.shortDescription,
        },
        {
            $formkit: 'textarea',
            name: 'longDescription',
            label: 'Description longue',
            rows: '6',
            help: "Description présente sur la page d'accueil de l'association",
            value: props.club.longDescription,
        },
    ]

    const uploadTypeUrl = (type) => `${import.meta.env.VITE_API_URL}/teams/teams/${props.club.id}/${type}`

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
            res.response.json().then((club) => emit('update:club', club))

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
