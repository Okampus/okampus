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

        <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-4">
                <h2 class="text-0 inline font-semibold">Logos</h2>
                <div class="grid gap-6 md:grid-cols-2 md-max:grid-rows-2">
                    <div class="flex flex-col">
                        <div class="text-2 mb-2 text-lg font-semibold">Logo (light mode)</div>
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
                        <div class="text-2 mb-2 text-lg font-semibold">Logo (dark mode)</div>
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
                <div>
                    <h2 class="text-0 inline font-semibold">Étapes de validations des événements</h2>
                    <button
                        class="fa fa-plus button-green ml-2 inline-flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                        @click="showValidationStepForm = true"
                    />
                </div>
                <div class="flex flex-wrap gap-2">
                    <div v-for="step in steps" :key="step.id" class="card bg-1 flex flex-col gap-1">
                        <div class="text-1 text-base font-semibold">Étape {{ step.step }}</div>
                        <EditableTextInput
                            v-model:show-input="step.editing"
                            v-model="step.name"
                            @validate="updateStep({ id: step.id, updateStep: { name: $event } })"
                        />
                        <div class="mt-2 flex flex-col gap-4">
                            <h3 class="text-1 text-base">Validateurs :</h3>
                            <UserActivity
                                v-for="user in step.users"
                                :key="user.id"
                                :user="user"
                                :subtitle="getRole(user)[locale]"
                            />
                            <button class="button-grey">
                                <i class="fa fa-plus" /> Ajouter un validateur
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import FormPopUp from '@/components/Form/FormPopUp.vue'
    import UserActivity from '@/components/App/General/UserActivity.vue'

    import FileInput from '@/components/Input/FileInput.vue'
    import EditableTextInput from '@/components/Input/EditableTextInput.vue'

    import { useI18n } from 'vue-i18n'
    import { useMutation, useQuery } from '@vue/apollo-composable'

    import { addValidationStep } from '@/graphql/queries/config/addValidationStep'
    import { updateValidationStep } from '@/graphql/queries/config/updateValidationStep'
    import { getLogos } from '@/graphql/queries/config/getLogos'
    import { unsetLogo } from '@/graphql/queries/config/unsetLogo'

    import { validationStepForm } from '@/shared/assets/form-schemas/validation-step'

    import { getRole } from '@/utils/users'
    import { getTenant } from '@/utils/getTenant'
    import { showSuccessToast } from '@/utils/toast'

    import { computed, ref, watchEffect } from 'vue'

    import { IMAGE } from '@/shared/assets/file-types'

    const { locale } = useI18n({ useScope: 'global' })

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
        showSuccessToast('Étape de validation bien ajoutée 🎉')
        showValidationStepForm.value = false
    })

    const { mutate: updateStep, onDone: onDoneUpdateStep } = useMutation(updateValidationStep)
    onDoneUpdateStep(() => {
        showSuccessToast('Étape renommée avec succès ✏️')
        showValidationStepForm.value = false
    })

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

    const steps = ref([])
    watchEffect(() => {
        steps.value = props.config.validationSteps.map((step) => ({
            editing: false,
            name: step.name,
            id: step.id,
            step: step.step,
            users: step.users,
        }))
    })

    const logoUploadUrl = `${import.meta.env.VITE_API_URL}/tenants/tenants/${props.config.id}/logo`
    const logoDarkUploadUrl = `${import.meta.env.VITE_API_URL}/tenants/tenants/${props.config.id}/logo-dark`
</script>
