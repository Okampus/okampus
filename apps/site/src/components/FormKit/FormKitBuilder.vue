<template>
    <div class="flex flex-col gap-4">
        <div class="card-0 flex w-full flex-col pt-8">
            <EditableText
                v-model="currentForm.name"
                placeholder="Nom du formulaire"
                text-class="text-2xl"
                @update:model-value="emit('change')"
            />
            <EditableText
                v-model="currentForm.description"
                placeholder="Description"
                text-class="text-lg"
                :single-line="false"
                @update:model-value="emit('change')"
            />
        </div>

        <VueDraggableNext
            v-model="currentForm.schema"
            handle=".handle"
            item-key="id"
            class="flex flex-col gap-4"
        >
            <transition-group name="grid">
                <HandleCard v-for="(element, i) in currentForm.schema" :key="element" class="relative">
                    <div
                        v-if="element.required"
                        v-tooltip="'Obligatoire'"
                        class="absolute left-6 top-2 cursor-default text-2xl text-red-500"
                    >
                        *
                    </div>

                    <div v-if="element.$formkit" class="flex flex-col gap-4">
                        <div class="flex w-full gap-2 md:items-center md:gap-4 md-max:flex-col">
                            <EditableText
                                :ref="(el) => (fieldRefs[`field-${i}`] = el)"
                                v-model="element.label"
                                class="grow"
                                placeholder="Nom du champ"
                                text-class="text-lg !px-2"
                                @update:model-value="emit('change')"
                            />
                            <FormKit
                                v-model="element.$formkit"
                                type="dropdown"
                                outer-class="mb-0 md-max:w-full"
                                :update="(value) => value.type"
                                :options="OPTIONS"
                                :default-option="
                                    OPTIONS.findIndex((value) => value.type === element.$formkit)
                                "
                                @update:model-value="emit('change')"
                            />
                        </div>

                        <div class="flex items-end justify-between">
                            <input
                                v-if="
                                    element.$formkit === TEXT ||
                                    element.$formkit === MULTIUSER ||
                                    element.$formkit === TEXTAREA
                                "
                                class="input !cursor-default md-max:w-full"
                                disabled
                                :placeholder="OPTIONS.find((option) => option.type === element.$formkit).name"
                            />
                            <input
                                v-if="element.$formkit === NUMBER"
                                type="number"
                                class="input !cursor-default md-max:w-full"
                                disabled
                                :placeholder="0"
                            />
                            <div
                                v-if="element.$formkit === RADIO || element.$formkit === CHECKLIST"
                                class="flex w-full flex-col items-start"
                            >
                                <div
                                    v-for="(option, j) in element.options"
                                    :key="option"
                                    class="flex w-full items-center gap-2"
                                >
                                    <input
                                        :type="element.$formkit === CHECKLIST ? 'checkbox' : 'radio'"
                                        class="h-6 w-6 !cursor-default"
                                        disabled
                                    />
                                    <EditableText
                                        :ref="
                                            (el) => {
                                                optionRefs[`option-${i}-${j}`] = el
                                            }
                                        "
                                        v-model="option.value"
                                        text-class="!py-1 !px-2"
                                        class="grow"
                                        :placeholder="`Option ${j + 1}`"
                                        @update:model-value="emit('change')"
                                    />
                                    <button
                                        v-if="element.options.length > 1"
                                        v-tooltip="`Supprimer`"
                                        class="fa fa-xmark text-0 h-8 w-6 text-2xl opacity-50"
                                        @click="
                                            () => {
                                                element.options = element.options.filter(
                                                    (_, idx) => idx !== j,
                                                )
                                                emit('change')
                                            }
                                        "
                                    />
                                </div>
                                <div class="mt-1 flex items-center gap-2">
                                    <input
                                        :type="element.$formkit === CHECKLIST ? 'checkbox' : 'radio'"
                                        class="h-6 w-6 !cursor-default"
                                        disabled
                                    />
                                    <button
                                        class="text-placeholder ml-2 cursor-text"
                                        @click="() => addOption(element, i)"
                                    >
                                        Ajouter une option
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="mt-2 flex items-center gap-2">
                            <button
                                class="button-blue flex h-8 w-8 items-center justify-center"
                                @click="
                                    () => {
                                        currentForm.schema.splice(
                                            currentForm.schema.indexOf(element),
                                            0,
                                            cloneDeep(element),
                                        )
                                        emit('change')
                                    }
                                "
                            >
                                <i class="fa fa-clone" />
                            </button>

                            <button
                                class="button-red flex h-8 w-8 items-center justify-center"
                                @click="
                                    () => {
                                        currentForm.schema = currentForm.schema.filter(
                                            (value) => value !== element,
                                        )
                                        emit('change')
                                    }
                                "
                            >
                                <i class="fa fa-trash" />
                            </button>

                            <div class="ml-4 flex items-center gap-2">
                                Obligatoire
                                <SwitchInput
                                    v-model="element.required"
                                    height="1.2rem"
                                    width="2.2rem"
                                    switch-validate-color="coral"
                                    @update:model-value="emit('change')"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- <div v-else class="flex">
                        <FormKit v-model="element.text" type="text" outer-class="w-full" />
                    </div> -->
                </HandleCard>
            </transition-group>
        </VueDraggableNext>
        <div class="flex gap-4">
            <button class="button-blue" @click="addOne">Ajouter un champ</button>
            <!-- <button class="button-blue" @click="addText">Ajouter un texte</button> -->
        </div>
    </div>
</template>

<script setup>
    import { FormKit } from '@formkit/vue'
    import { VueDraggableNext } from 'vue-draggable-next'

    import HandleCard from '@/components/App/Card/HandleCard.vue'
    import SwitchInput from '@/components/Input/SwitchInput.vue'
    import EditableText from '@/components/Input/EditableText.vue'

    import {
        OPTIONS,
        TEXT,
        TEXTAREA,
        NUMBER,
        RADIO,
        CHECKLIST,
        MULTIUSER,
        OPTION_TYPES,
    } from '@/shared/types/formkit-builder-input-types.enum'

    import { cloneDeep } from 'lodash'
    import { reactive, ref, watch } from 'vue'

    import { searchUsers } from '@/graphql/queries/users/searchUsers'

    const props = defineProps({
        form: {
            type: Object,
            default: null,
        },
        saveCallback: {
            type: Function,
            default: null,
        },
        includeTitle: {
            type: Boolean,
            default: false,
        },
        isNewForm: {
            type: Boolean,
            default: false,
        },
        cancellable: {
            type: Boolean,
            default: true,
        },
    })

    const formName = ref('')
    const formDescription = ref('')

    const initParseSchema = (schema) => {
        if (props.includeTitle) {
            if (schema?.[1]?.$el === 'h4') {
                formDescription.value = schema[1].children[0]
                schema.splice(1, 1)
            }

            if (schema?.[0]?.$el === 'h1') {
                formName.value = schema[0].children[0]
                schema.splice(0, 1)
            }
        }

        schema = schema.map((el) => {
            const { validation, ...element } = el
            if (validation?.includes('required')) {
                element.required = true
            } else {
                element.required = false
            }
            return element
        })

        return schema
    }

    const schema = initParseSchema(cloneDeep(props.form?.meta?.schema) ?? [])
    const currentForm = reactive({
        type: props.form?.meta?.formType,
        name: formName.value || (props.form?.name ?? 'Formulaire sans titre'),
        description: formDescription.value || (props.form?.description ?? ''),
        isTemplate: props.form?.isTemplate ?? false,
        schema,
    })

    watch(
        () => props.form,
        (form) => {
            currentForm.type = form.meta?.formType
            currentForm.name = form.name ?? 'Formulaire sans titre'
            currentForm.isTemplate = form.isTemplate ?? false
            currentForm.description = form.description ?? ''
            currentForm.schema = cloneDeep(form.meta?.schema) ?? []
        },
    )

    const emit = defineEmits(['update:form', 'cancel', 'change', 'save-success'])

    const fieldRefs = ref({})
    const optionRefs = ref({})

    const addOne = () => {
        currentForm.schema.push({
            $formkit: 'text',
            label: 'Nom du champ',
            required: false,
            options: [{ value: 'Option 1' }],
        })

        setTimeout(() => {
            fieldRefs.value[`field-${currentForm.schema.length - 1}`].input.focus()
            fieldRefs.value[`field-${currentForm.schema.length - 1}`].input.select()
        }, 5)

        emit('change')
    }
    const addOption = (element, i) => {
        element.options.push({
            value: `Option ${element.options.length + 1}`,
        })

        setTimeout(() => {
            optionRefs.value[`option-${i}-${element.options.length - 1}`].input.focus()
            optionRefs.value[`option-${i}-${element.options.length - 1}`].input.select()
        }, 5)

        emit('change')
    }

    const cleanSchema = () => {
        const schema = currentForm.schema.map((el) => {
            const { required, ...element } = el
            if (required) element.validation = 'required'
            if (!OPTION_TYPES.includes(element.$formkit)) delete element.options

            if (element.$formkit === MULTIUSER) {
                element.$formkit = 'multisearch'
                element.searchQuery = searchUsers
                element.queryName = 'searchUsers'
            }

            return element
        })

        if (props.includeTitle) {
            schema.unshift({
                $el: 'h4',
                children: [currentForm.description],
            })
            schema.unshift({
                $el: 'h1',
                children: [currentForm.name],
            })
        }

        return schema
    }

    const save = () => {
        props.saveCallback({ ...currentForm, schema: cleanSchema() })
        emit('save-success', true)
    }

    if (props.isNewForm) {
        emit('change')
    }

    defineExpose({ save })
</script>
