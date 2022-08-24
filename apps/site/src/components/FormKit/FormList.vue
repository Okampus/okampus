<template>
    <div class="h-fit w-full">
        <div
            v-if="isNil(defaultForm) && (!forms || !forms.length)"
            class="card-0 flex flex-col gap-2 text-center"
        >
            <h3 class="font-semibold">Aucun formulaire pour le moment</h3>
            <h4>
                <span class="link-blue" @click="showCreateForm">Cliquez ici</span> pour créer le premier ✏️
            </h4>
        </div>
        <template v-else>
            <div class="grid grid-cols-[repeat(auto-fit,minmax(8rem,17rem))] gap-6">
                <FileCard
                    v-for="form of forms"
                    :key="form.id"
                    :file="{
                        id: form.id,
                        fileType: FORMKIT,
                        meta: {
                            formType: form.type,
                            schema: form.schema,
                        },
                        teamId,
                        lastModifiedAt: form.updatedAt,
                        name: form.name,
                    }"
                    :class="
                        form.id === modelValue?.id ? 'outline outline-2' : 'hover:outline hover:outline-1'
                    "
                    class="relative cursor-pointer outline-indigo-600"
                    @click="form.id !== modelValue?.id ? emit('update:model-value', form) : () => {}"
                >
                    <template #inner>
                        <TipRelativeDate
                            v-if="form.updatedAt"
                            :date="form.updatedAt"
                            date-style="short"
                            text-class="file-card-inner"
                        />
                        <i
                            v-if="form.id === modelValue?.id"
                            class="fa fa-check button-indigo absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full !p-0"
                        />
                    </template>
                </FileCard>

                <FileCard
                    :file="{
                        fileType: FORMKIT,
                        name: defaultForm.name ?? 'Formulaire par défaut',
                        meta: {
                            schema: defaultForm.schema ?? [],
                            formType: defaultForm.type ?? '',
                        },
                    }"
                    :class="isNil(modelValue?.id) ? 'outline outline-2' : 'hover:outline hover:outline-1'"
                    class="relative cursor-pointer outline-indigo-600"
                    @click="modelValue?.id ? emit('update:model-value', defaultForm) : () => {}"
                >
                    <template #inner>
                        <div v-tooltip="defaultForm.description ?? 'Formulaire par défaut'">
                            {{ defaultForm.inner ?? 'Par défaut' }}
                        </div>
                        <i
                            v-if="isNil(modelValue?.id)"
                            class="fa fa-check button-indigo absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full !p-0"
                        />
                    </template>
                </FileCard>

                <div class="card-0 flex flex-col items-center justify-center">
                    <button class="button-indigo h-10 w-10 rounded-full" @click="showCreateForm">
                        <i class="fa fa-plus text-xl" />
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'
    import FormKitBuilder from '@/components/FormKit/FormKitBuilder.vue'
    import FileCard from '@/components/App/Card/FileCard.vue'

    import { isNil } from 'lodash'
    import { markRaw } from 'vue'

    import { FORMKIT } from '@/shared/assets/file-types'
    import { emitter } from '@/shared/modules/emitter'
    import { showSuccessToast } from '@/utils/toast'
    import { createForm } from '@/graphql/queries/forms/createForm'
    import { useMutation } from '@vue/apollo-composable'

    const props = defineProps({
        forms: {
            type: Array,
            default: () => [],
        },
        teamId: {
            type: Number,
            required: true,
        },
        select: {
            type: Boolean,
            default: false,
        },
        defaultForm: {
            type: Object,
            default: null,
        },
        formType: {
            type: String,
            required: true,
        },
        modelValue: {
            type: Object,
            default: () => ({}),
        },
    })

    const { mutate: createTeamForm, onDone: onDoneCreate } = useMutation(createForm)
    onDoneCreate(() => showSuccessToast('Formulaire créé !'))

    const emit = defineEmits(['update:model-value'])
    const showCreateForm = () => {
        emitter.emit('show-bottom-sheet', {
            isNew: true,
            title: 'Création de formulaire 📝',
            component: markRaw(FormKitBuilder),
            props: {
                form: { meta: { formType: props.formType } },
                isNewForm: true,
                saveCallback: (createForm) =>
                    createTeamForm({
                        id: props.teamId,
                        createForm,
                    }),
            },
        })
    }
</script>
