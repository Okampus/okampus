<template>
    <div class="flex flex-col">
        <!-- <h1 class="mb-6 text-3xl font-bold">Créer votre formulaire</h1> -->
        <div class="w-96">
            <FormKit v-model="formTitle" type="text" label="Titre du Formulaire"></FormKit>
        </div>
        <FormKit v-model="formDescription" type="textarea" label="Description du Formulaire"></FormKit>
        <VueDraggableNext v-model="schema" handle=".handle" item-key="id" class="flex flex-col gap-4">
            <transition-group name="grid">
                <div v-for="step in steps" :key="step.id" class="group card bg-1 flex flex-col">
                    <div class="bg-1 mt-8 rounded-md p-4">
                        <div v-if="element.$formkit">
                            <div class="flex items-center gap-4">
                                <FormKit v-model="element.label" type="text" label="Nom de l'évenement" />
                                <FormKit
                                    v-model="element.$formkit"
                                    type="select"
                                    :options="types"
                                    label="Type d'input"
                                    @vnode-updated="() => patchSchema(index)"
                                ></FormKit>
                                <div class="mt-4">
                                    <FormKit
                                        v-model="element.required"
                                        type="checkbox"
                                        label="Champ requis"
                                        @update:model-value="
                                            () => (element.validation = element.required ? 'required' : null)
                                        "
                                    ></FormKit>
                                </div>
                                <button class="mt-6 text-red-500" @click="() => removeOne(index)">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div v-if="element.options">
                                <div class="flex flex-wrap items-center gap-4">
                                    <div v-for="(option, idx) in element.options" :key="idx">
                                        <FormKit
                                            v-model="element.options[idx]"
                                            type="text"
                                            :label="'Option ' + (idx + 1)"
                                        ></FormKit>
                                    </div>
                                </div>
                                <button
                                    class="mt-4 w-fit rounded-md bg-blue-500 py-1 px-4 text-white"
                                    @click="() => addOption(index)"
                                >
                                    Ajouter une option
                                </button>
                            </div>
                            <div v-if="element.min != undefined">
                                <div class="flex flex-wrap items-center gap-4">
                                    <FormKit v-model="element.min" type="number" label="Minimum"></FormKit>
                                    <FormKit v-model="element.max" type="number" label="Maximum"></FormKit>
                                </div>
                            </div>
                        </div>
                        <div v-else class="flex">
                            <FormKit
                                v-model="element.children"
                                type="text"
                                label="Titre de la section"
                                outer-class="w-full"
                            />
                            <button class="mt-6 w-8 text-red-500" @click="() => removeOne(index)">
                                <i class="fas fa-times" />
                            </button>
                        </div>
                    </div>
                </div>
            </transition-group>
        </VueDraggableNext>
        <div class="flex gap-4">
            <button class="w-fit rounded-md bg-blue-500 py-1 px-4 text-white" @click="addOne">
                Ajouter un champ
            </button>
            <button class="w-fit rounded-md bg-blue-500 py-1 px-4 text-white" @click="addText">
                Ajouter un texte
            </button>
        </div>
        <div class="mt-8 flex w-full">
            <button
                class="w-fit rounded-md bg-blue-500 py-1 px-4 text-lg font-bold text-white"
                @click="submit"
            >
                Enregistrer
            </button>
        </div>
    </div>
</template>

<script setup>
    import { VueDraggableNext } from 'vue-draggable-next'
    import { FormKit } from '@formkit/vue'
    import { ref, watch } from 'vue'
    import { cloneDeep } from 'lodash'
    // import { useClubsStore } from '@/store/clubs.store'
    // import { showErrorToast, showInfoToast, showSuccessToast } from '@/utils/toast.js'

    // const clubs = useClubsStore()

    // const schema = ref([])

    const props = defineProps({
        form: {
            type: Object,
            required: false,
            default: null,
        },
    })

    const formName = ref(props.form.name)
    const formDescription = ref(props.form.description)
    const schema = ref(cloneDeep(props.form.schema))

    watch(props.form, (form) => {
        formName.value = form.name
        formDescription.value = form.description
        schema.value = form.schema
    })

    // const drag = ref(false)
    // const emit = defineEmits(['update'])

    // const loadSchema = async () => {
    //     if (!props.formId) {
    //         schema.value = ''
    //         formTitle.value = ''
    //         formDescription.value = ''
    //         return
    //     }
    //     await clubs.getForm(props.formId).then((res) => {
    //         schema.value = res.form
    //         formTitle.value = res.name
    //         formDescription.value = res.description
    //     })
    // }

    // const addOne = () => {
    //     schema.value.push({
    //         $formkit: 'text',
    //         label: '',
    //         help: '',
    //         validation: null,
    //     })
    // }

    // const addText = () => {
    //     schema.value.push({
    //         $el: 'h1',
    //         children: '',
    //     })
    // }

    // const removeOne = (idx) => {
    //     schema.value.splice(idx, 1)
    // }

    // const addOption = (idx) => {
    //     schema.value[idx].options.push('')
    // }

    // const patchSchema = (idx) => {
    //     if (['select', 'radio', 'checkbox'].includes(schema.value[idx].$formkit)) {
    //         if (!schema.value[idx].options) {
    //             schema.value[idx].options = ['']
    //         }
    //     } else if (schema.value[idx].options) {
    //         delete schema.value[idx].options
    //     }
    //     if (schema.value[idx].$formkit === 'range') {
    //         if (!schema.value[idx].min) {
    //             schema.value[idx].min = 0
    //             schema.value[idx].max = 10
    //         }
    //     } else if (schema.value[idx].min) {
    //         delete schema.value[idx].min
    //         delete schema.value[idx].max
    //     }
    // }

    // const createNew = async () => {
    //     await clubs
    //         .postForm(clubs.club.id, {
    //             name: formTitle.value,
    //             description: formDescription.value,
    //             form: schema.value,
    //             isTemplate: false,
    //         })
    //         .then(() => showSuccessToast('Le formulaire a bien été créé 📝'))
    //         .catch((err) => showErrorToast(err.message))
    // }

    // const update = async () => {
    //     await clubs
    //         .patchForm(props.formId, {
    //             form: schema.value,
    //             name: formTitle.value,
    //             description: formDescription.value,
    //         })
    //         .then(() => showInfoToast('Formulaire mis à jour 📝'))
    //         .catch((err) => showErrorToast(err.message))
    // }

    // const submit = async () => {
    //     if (!props.formId) {
    //         await createNew()
    //     } else {
    //         await update()
    //     }
    //     emit('update')
    // }

    // const types = [
    //     {
    //         value: 'text',
    //         label: 'Réponse courte',
    //     },
    //     {
    //         value: 'textarea',
    //         label: 'Paragraphe',
    //     },
    //     {
    //         value: 'email',
    //         label: 'Email',
    //     },
    //     {
    //         value: 'number',
    //         label: 'Nombre',
    //     },
    //     {
    //         value: 'date',
    //         label: 'Date',
    //     },
    //     {
    //         value: 'datetime-local',
    //         label: 'Date et heure',
    //     },
    //     {
    //         value: 'time',
    //         label: 'Heure',
    //     },
    //     {
    //         value: 'url',
    //         label: 'Lien',
    //     },
    //     {
    //         value: 'tel',
    //         label: 'Numéro de téléphone',
    //     },
    //     {
    //         value: 'color',
    //         label: 'Couleur',
    //     },
    //     {
    //         value: 'radio',
    //         label: 'Radio',
    //     },
    //     {
    //         value: 'checkbox',
    //         label: 'Case à cocher',
    //     },
    //     {
    //         value: 'select',
    //         label: 'Liste déroulante',
    //     },
    //     {
    //         value: 'range',
    //         label: 'Range',
    //     },
    // ]

    // watch(
    //     () => props.formId,
    //     async () => await loadSchema(),
    // )
</script>
