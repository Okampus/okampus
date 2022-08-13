<template>
    <div class="card-content">
        <FormPopUp
            v-model:show="showValidationStepForm"
            :submit="
                (data) =>
                    addStep({
                        createStep: {
                            step: config.validationSteps.length + 1,
                            name: data.name,
                            type: 'TeamEvent',
                            users: data.users.map((user) => user.realId),
                        },
                    })
            "
            :form-schema="validationStepForm"
        />

        <div class="flex flex-col gap-14">
            <div class="flex flex-col gap-4">
                <h1 class="text-0 inline font-semibold">Logos</h1>
                <div class="grid gap-6 md:grid-cols-2 md-max:grid-rows-2">
                    <div class="flex flex-col">
                        <div class="text-2 mb-2 text-lg font-semibold">Logo thème clair</div>
                        <FileInput
                            :model-value="logo"
                            :file-type="IMAGE"
                            :image-params="{
                                url: logoUploadUrl,
                                ratio: 1 / 3,
                                minWidth: 600,
                                onUploadSuccess: addFileToLogos,
                            }"
                            :remove-callback="() => removeLogo({ id: getTenant(), isLogoDark: false })"
                        />
                    </div>
                    <div class="flex flex-col">
                        <div class="text-2 mb-2 text-lg font-semibold">Logo thème sombre</div>
                        <FileInput
                            :model-value="logoDark"
                            :file-type="IMAGE"
                            :image-params="{
                                url: logoDarkUploadUrl,
                                ratio: 1 / 3,
                                minWidth: 600,
                                onUploadSuccess: addFileToLogos,
                            }"
                            :remove-callback="() => removeLogo({ id: getTenant(), isLogoDark: true })"
                        />
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-4">
                <div class="mb-4 flex items-center">
                    <h1 class="text-0 inline font-semibold">Étapes de validations des événements</h1>
                    <button
                        class="fa fa-plus button-green ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-lg"
                        @click="showValidationStepForm = true"
                    />
                </div>
                <div v-if="!steps.length" class="text-xl font-semibold">
                    Aucune étape de validation.
                    <span class="link-blue" @click="showValidationStepForm = true"
                        >Cliquez pour ajouter la première ✏️ !</span
                    >
                </div>
                <div v-else>
                    <VueDraggableNext
                        v-model="steps"
                        handle=".handle"
                        class="grid grid-cols-[repeat(auto-fit,minmax(23rem,1fr))] gap-6"
                        @change="
                            insertStep({ step: $event.moved.oldIndex + 1, atStep: $event.moved.newIndex + 1 })
                        "
                    >
                        <transition-group name="grid">
                            <div v-for="step in steps" :key="step.id" class="group card bg-1 flex flex-col">
                                <div
                                    class="handle -mt-2 mb-2 flex h-6 w-full cursor-move justify-center opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <i class="text-3 fa fa-grip" />
                                </div>
                                <div class="mb-6 flex justify-between gap-4">
                                    <EditableTextInput
                                        v-model:show-input="step.editingName"
                                        v-model="step.name"
                                        placeholder="Nom de l'étape"
                                        :min-char="10"
                                        text-class="text-lg"
                                        min-char-message="Le nom d'une étape de validation doit faire au moins 10 caractères"
                                        @validate="updateStep({ id: step.id, updateStep: { name: $event } })"
                                    />
                                    <div
                                        v-tooltip="`Étape ${step.step}`"
                                        class="text-1 cursor-default text-xl font-semibold"
                                    >
                                        #{{ step.step }}
                                    </div>
                                </div>
                                <div class="mb-4 flex flex-col">
                                    <div
                                        class="text-3 mb-1 flex cursor-pointer items-center justify-between hover:text-blue-400 dark:hover:text-blue-600"
                                        @click="step.editingUsers = !step.editingUsers"
                                    >
                                        <div class="text-sm font-semibold">Validateurs</div>
                                        <i
                                            v-tooltip="'Modifier les validateurs'"
                                            class="far fa-pen-to-square text-xl"
                                        />
                                    </div>
                                    <div v-if="step.editingUsers" class="mt-3">
                                        <FormKit
                                            v-model="step.users"
                                            type="multisearch"
                                            :search-query="searchUsers"
                                            query-name="searchUsers"
                                            placeholder="Changez puis validez ☑️"
                                        />
                                        <div class="flex gap-2 self-start" :class="textClass">
                                            <button
                                                class="button-green mt-1 flex items-center gap-2 py-1.5 text-base"
                                                @click="
                                                    updateStep({
                                                        id: step.id,
                                                        updateStep: {
                                                            users: step.users.map((user) => user.realId),
                                                        },
                                                    })
                                                "
                                            >
                                                Valider
                                            </button>
                                            <button
                                                class="button-grey mt-1 flex items-center gap-2 py-1.5 text-base"
                                                @click="cancelUsers(step)"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                    <template v-else>
                                        <LabelIndexedEntity
                                            v-for="user in step.users"
                                            :key="user.id"
                                            class="mb-1"
                                            :entity="user"
                                            :closable="false"
                                        />
                                    </template>
                                </div>
                            </div>
                        </transition-group>
                    </VueDraggableNext>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { VueDraggableNext } from 'vue-draggable-next'

    import FormPopUp from '@/components/Form/FormPopUp.vue'
    import LabelIndexedEntity from '@/components/UI/Label/LabelIndexedEntity.vue'
    import FileInput from '@/components/Input/FileInput.vue'
    import EditableTextInput from '@/components/Input/EditableTextInput.vue'

    import { FormKit } from '@formkit/vue'

    import { useMutation, useQuery } from '@vue/apollo-composable'

    import { addValidationStep } from '@/graphql/queries/config/addValidationStep'
    import { updateValidationStep } from '@/graphql/queries/config/updateValidationStep'
    import { insertValidationStep } from '@/graphql/queries/config/insertValidationStep'

    import { getLogos } from '@/graphql/queries/config/getLogos'
    import { unsetLogo } from '@/graphql/queries/config/unsetLogo'

    import { searchUsers } from '@/graphql/queries/users/searchUsers'

    import { validationStepForm } from '@/shared/assets/form-schemas/validation-step'

    import { fullname } from '@/utils/users'
    import { getTenant } from '@/utils/getTenant'
    import { showSuccessToast } from '@/utils/toast'

    import { computed, ref, watchEffect } from 'vue'

    import { IMAGE } from '@/shared/assets/file-types'

    const showValidationStepForm = ref(false)

    const { result } = useQuery(getLogos, { id: getTenant() })

    const logos = ref([])
    watchEffect(() => (logos.value = result.value?.getLogos ?? []))

    const logo = computed(() => logos.value.find((logo) => logo.type === 'logo')?.file)
    const logoDark = computed(() => logos.value.find((logo) => logo.type === 'logoDark')?.file)

    const addFileToLogos = async (incomingMessage) => {
        showSuccessToast('Logo ajouté avec succès 🎉')
        incomingMessage.response.json().then((file) => {
            if (file.type === 'logo') logos.value = logos.value.filter((logo) => logo.type !== 'logo')

            if (file.type === 'logoDark') logos.value = logos.value.filter((logo) => logo.type !== 'logoDark')

            logos.value.push(file)
        })
    }

    const { mutate: addStep, onDone: onDoneAddStep } = useMutation(addValidationStep)
    onDoneAddStep(() => {
        showSuccessToast('Étape de validation ajoutée 🎉')
        showValidationStepForm.value = false
    })

    const { mutate: updateStep, onDone: onDoneUpdateStep } = useMutation(updateValidationStep)
    onDoneUpdateStep(() => showSuccessToast('Étape modifiée avec succès ✏️'))

    const { mutate: insertStep, onDone: onDoneInsertStep } = useMutation(insertValidationStep)
    onDoneInsertStep(() => showSuccessToast('Ordre des étapes de validation modifié ✏️'))

    const { mutate: removeLogo, onDone: onDoneUnsetLogo } = useMutation(unsetLogo)
    onDoneUnsetLogo((param) => {
        showSuccessToast('Logo supprimé !')
        if (param.data.unsetLogo.logo === null)
            logos.value = logos.value.filter((logo) => logo.type !== 'logo')

        if (param.data.unsetLogo.logoDark === null)
            logos.value = logos.value.filter((logo) => logo.type !== 'logoDark')
    })

    const props = defineProps({
        config: {
            type: Object,
            required: true,
        },
    })

    const cancelUsers = (step) => {
        step.editingUsers = false
        step.users =
            props.config.validationSteps
                .find((step) => step.id === step.id)
                ?.users?.map?.((user) => ({
                    realId: user.id,
                    metaType: 'user',
                    title: fullname(user),
                    picture: user.avatar,
                })) ?? []
    }

    const steps = ref([])
    watchEffect(() => {
        steps.value = props.config.validationSteps.map((step) => ({
            editingName: false,
            editingUsers: false,
            name: step.name,
            id: step.id,
            step: step.step,
            users: step.users.map((user) => ({
                realId: user.id,
                metaType: 'user',
                title: fullname(user),
                picture: user.avatar,
            })),
        }))
    })

    const logoUploadUrl = `${import.meta.env.VITE_API_URL}/tenants/tenants/${props.config.id}/logo`
    const logoDarkUploadUrl = `${import.meta.env.VITE_API_URL}/tenants/tenants/${props.config.id}/logo-dark`
</script>
