<template>
    <div class="flex flex-col items-center mt-8 w-full">
        <div class="flex flex-col gap-4 p-8 card-2 centered-container">
            <h1 class="text-3xl font-bold">Créer votre formulaire</h1>
            <div class="w-96">
                <FormKit v-model="formTitle" type="text" label="Titre du Formulaire"></FormKit>
            </div>
            <FormKit v-model="formDescription" type="textarea" label="Description du Formulaire"></FormKit>
            <draggable v-model="schema" group="inputs" item-key="id" @start="drag = true" @end="drag = false">
                <template #item="{ element, index }">
                    <div class="p-4 mt-8 rounded-md bg-1">
                        <div v-if="element.$formkit">
                            <div class="flex gap-4 items-center">
                                <FormKit
                                    v-model="element.label"
                                    type="text"
                                    label="Nom de l'évenement"
                                    class=""
                                ></FormKit>
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
                                <div class="flex flex-wrap gap-4 items-center">
                                    <div v-for="(option, idx) in element.options" :key="idx">
                                        <FormKit
                                            v-model="element.options[idx]"
                                            type="text"
                                            :label="'Option ' + (idx + 1)"
                                        ></FormKit>
                                    </div>
                                </div>
                                <button
                                    class="py-1 px-4 mt-4 w-fit text-white bg-blue-500 rounded-md"
                                    @click="() => addOption(index)"
                                >
                                    Ajouter une option
                                </button>
                            </div>
                            <div v-if="element.min != undefined">
                                <div class="flex flex-wrap gap-4 items-center">
                                    <FormKit v-model="element.min" type="number" label="Minimum"></FormKit>
                                    <FormKit v-model="element.max" type="number" label="Maximum"></FormKit>
                                </div>
                            </div>
                        </div>
                        <div v-else class="flex">
                            <div class="w-full">
                                <FormKit
                                    v-model="element.children"
                                    type="text"
                                    label="Titre de la section"
                                ></FormKit>
                            </div>
                            <button class="mt-6 w-8 text-red-500" @click="() => removeOne(index)">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </template>
            </draggable>
            <div class="flex gap-4">
                <button class="py-1 px-4 w-fit text-white bg-blue-500 rounded-md" @click="addOne">
                    Ajouter un champ
                </button>
                <button class="py-1 px-4 w-fit text-white bg-blue-500 rounded-md" @click="addText">
                    Ajouter un texte
                </button>
            </div>
            <div class="flex mt-8 w-full">
                <button
                    class="py-1 px-4 w-fit text-lg font-bold text-white bg-blue-500 rounded-md"
                    @click="submit"
                >
                    Enregistrer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { FormKit } from '@formkit/vue'
    import draggable from 'vuedraggable'
    import { ref, watch } from 'vue'
    import { useClubsStore } from '@/store/clubs.store'
    import { emitter } from '@/shared/modules/emitter'

    const clubs = useClubsStore()

    const schema = ref([])
    const formTitle = ref('')
    const formDescription = ref('')
    const drag = ref(false)

    const props = defineProps({
        formId: {
            type: Number,
            required: false,
            default: null,
        },
    })

    const emit = defineEmits(['update'])

    const loadSchema = async () => {
        if (!props.formId) {
            schema.value = ''
            formTitle.value = ''
            formDescription.value = ''
            return
        }
        await clubs.getForm(props.formId).then((res) => {
            schema.value = res.form
            formTitle.value = res.name
            formDescription.value = res.description
        })
    }

    const addOne = () => {
        schema.value.push({
            $formkit: 'text',
            label: '',
            help: '',
            validation: null,
        })
    }

    const addText = () => {
        schema.value.push({
            $el: 'h1',
            children: '',
        })
    }

    const removeOne = (idx) => {
        schema.value.splice(idx, 1)
    }

    const addOption = (idx) => {
        schema.value[idx].options.push('')
    }

    const patchSchema = (idx) => {
        if (['select', 'radio', 'checkbox'].includes(schema.value[idx].$formkit)) {
            if (!schema.value[idx].options) {
                schema.value[idx].options = ['']
            }
        } else if (schema.value[idx].options) {
            delete schema.value[idx].options
        }
        if (schema.value[idx].$formkit === 'range') {
            if (!schema.value[idx].min) {
                schema.value[idx].min = 0
                schema.value[idx].max = 10
            }
        } else if (schema.value[idx].min) {
            delete schema.value[idx].min
            delete schema.value[idx].max
        }
    }

    const createNew = async () => {
        await clubs
            .postForm(clubs.club.teamId, {
                name: formTitle.value,
                description: formDescription.value,
                form: schema.value,
                isTemplate: false,
            })
            .then(() => {
                emitter.emit('show-toast', {
                    message: 'Formulaire crée avec succès',
                    type: 'success',
                })
            })
            .catch((err) => {
                emitter.emit('show-toast', {
                    message: err,
                    type: 'error',
                })
            })
    }

    const update = async () => {
        await clubs
            .patchForm(props.formId, {
                form: schema.value,
                name: formTitle.value,
                description: formDescription.value,
            })
            .then(() => {
                emitter.emit('show-toast', {
                    message: 'Formulaire mis à jour',
                    type: 'success',
                })
            })
            .catch((err) => {
                emitter.emit('show-toast', {
                    message: err,
                    type: 'error',
                })
            })
    }

    const submit = async () => {
        if (!props.formId) {
            await createNew()
        } else {
            await update()
        }
        emit('update')
    }

    const types = [
        {
            value: 'text',
            label: 'Réponse courte',
        },
        {
            value: 'textarea',
            label: 'Paragraphe',
        },
        {
            value: 'email',
            label: 'Email',
        },
        {
            value: 'number',
            label: 'Nombre',
        },
        {
            value: 'date',
            label: 'Date',
        },
        {
            value: 'datetime-local',
            label: 'Date et heure',
        },
        {
            value: 'time',
            label: 'Heure',
        },
        {
            value: 'url',
            label: 'Lien',
        },
        {
            value: 'tel',
            label: 'Numéro de téléphone',
        },
        {
            value: 'color',
            label: 'Couleur',
        },
        {
            value: 'radio',
            label: 'Radio',
        },
        {
            value: 'checkbox',
            label: 'Case à cocher',
        },
        {
            value: 'select',
            label: 'Liste déroulante',
        },
        {
            value: 'range',
            label: 'Range',
        },
    ]

    watch(
        () => props.formId,
        async () => await loadSchema(),
    )
</script>
