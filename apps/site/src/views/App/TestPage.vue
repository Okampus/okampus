<template>
    <CardPage>
        <section class="flex flex-col gap-4">
            <label>Type<span class="text-red-500">*</span></label>
            <RadioInput
                v-model="model[0].radioChoice"
                :choices="[
                    { name: 'Recette', key: 're' },
                    { name: 'Dépense', key: 'de' },
                ]"
            />

            <div>
                <div for="doc-type">Catégorie<span class="text-red-500">*</span></div>
                <SelectInput
                    v-model="model[0].categorie"
                    :choices="listOfCategories"
                    :ico="listOfCategories"
                />
                <div v-if="v$.model[0].typePaiement.$error" class="flex flex-col">
                    <AppAlert v-for="(error, i) in v$.model[0].typePaiement.$errors" :key="i" type="error">
                        <template #message>
                            <div class="subtitle">
                                {{ error.$message }}
                            </div>
                        </template>
                    </AppAlert>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-12">
                <div>
                    <label
                        >Montant<span class="text-red-500">*</span>
                        <input
                            v-model="model[0].montant"
                            class="w-full input"
                            :class="{ 'ring-2 ring-red-500': v$.model[0].montant.$error }"
                            type="number"
                            placeholder="Nom du document"
                        />
                    </label>
                    <div v-if="v$.model[0].montant.$error" class="flex flex-col">
                        <AppAlert v-for="(error, i) in v$.model[0].montant.$errors" :key="i" type="error">
                            <template #message>
                                <div class="subtitle">
                                    {{ error.$message }}
                                </div>
                            </template>
                        </AppAlert>
                    </div>
                </div>
                <div>
                    <div for="doc-type">Type de paiement<span class="text-red-500">*</span></div>
                    <SelectInput v-model="model[0].typePaiement" :choices="listchoices" />
                    <div v-if="v$.model[0].typePaiement.$error" class="flex flex-col">
                        <AppAlert
                            v-for="(error, i) in v$.model[0].typePaiement.$errors"
                            :key="i"
                            type="error"
                        >
                            <template #message>
                                <div class="subtitle">
                                    {{ error.$message }}
                                </div>
                            </template>
                        </AppAlert>
                    </div>
                </div>
            </div>

            <div>
                <label
                    >Date<span class="text-red-500">*</span>
                    <input
                        v-model="model[0].date"
                        class="w-full input"
                        :class="{ 'ring-2 ring-red-500': v$.model[0].date.$error }"
                        type="date"
                    />
                </label>
                <div v-if="v$.model[0].date.$error" class="flex flex-col">
                    <AppAlert v-for="(error, i) in v$.model[0].date.$errors" :key="i" type="error">
                        <template #message>
                            <div class="subtitle">
                                {{ error.$message }}
                            </div>
                        </template>
                    </AppAlert>
                </div>
            </div>
            <p>{{ categories }}</p>

            <div>
                <label
                    >Description (Facultatif)
                    <textarea
                        v-model="model[0].description"
                        placeholder="Description du document"
                        class="w-full leading-tight focus:outline-none input focus:shadow-outline"
                        type="text"
                        rows="5"
                    />
                </label>
            </div>

            <div>
                <FileInput
                    v-model="model[0].files"
                    :img-preview="true"
                    :file-limit="-1"
                    class="mt-4 w-full h-52 rounded"
                    :class="{ 'ring-2 ring-red-500': v$.model[0].files.$error }"
                    :size-limit="2097152"
                    :regex-mimes="[
                        '^image/(.)+',
                        '^audio/(.)+',
                        '^text/(.)+',
                        '^video/(.)+',
                        '^application/msword',
                        '^application/xml',
                        '^application/json',
                        '^application/pdf',
                        String.raw`^application/vnd\.oasis\.opendocument\.presentation`,
                        String.raw`^application/vnd\.oasis\.opendocument\.spreadsheet`,
                        String.raw`^application/vnd\.oasis\.opendocument\.text`,
                        String.raw`^application/vnd\.ms-powerpoint`,
                        String.raw`^application/vnd\.openxmlformats-officedocument\.presentationml\.presentation`,
                        String.raw`^application/vnd\.ms-excel`,
                        String.raw`^application/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet`,
                        String.raw`^application/vnd\.openxmlformats-officedocument\.wordprocessingml\.document`,
                    ]"
                />
                <div v-if="v$.model[0].files.$error" class="flex flex-col">
                    <AppAlert v-for="(error, i) in v$.model[0].files.$errors" :key="i" type="error">
                        <template #message>
                            <div class="subtitle">
                                {{ error.$message }}
                            </div>
                        </template>
                    </AppAlert>
                </div>
            </div>
            <div class="flex">
                <button class="shrink-0 mx-2 button-green" @click="submitForm">
                    <p><i class="fas fa-check"></i> Confirmer</p>
                </button>
                <button class="shrink-0 mx-2 button-red" @click="freeForm">
                    <p><i class="fas fa-trash"></i> Annuler</p>
                </button>
            </div>
        </section>
    </CardPage>
</template>

<script>
    import AppAlert from '@/components/App/AppAlert.vue'
    import FileInput from '@/components/Input/FileInput.vue'
    import RadioInput from '@/components/Input/RadioInput.vue'
    import SelectInput from '@/components/Input/SelectInput.vue'
    import useVuelidate from '@vuelidate/core'
    import { required } from '@vuelidate/validators'
    import CardPage from '../App/CardPage.vue'
    /* import { useCategoriesStore } from '@/store/categories.store'

    const categories = useCategoriesStore() */

    export default {
        components: {
            RadioInput,
            SelectInput,
            FileInput,
            AppAlert,
            CardPage,
        },
        setup() {
            return { v$: useVuelidate() }
        },
        validations() {
            return {
                model: [
                    {
                        radioChoice: { required },
                        files: { required },
                        montant: {
                            required,
                        },
                        typePaiement: {
                            required,
                        },
                        categorie: {
                            required,
                        },
                        date: {
                            required,
                        },
                        description: {},
                    },
                ],
            }
        },
        data() {
            return {
                model: [
                    {
                        radioChoice: '',
                        files: [],
                        categorie: '',
                        docName: '',
                        description: '',
                    },
                ],
                listchoices: ['Moyen 1', 'Moyen 2', 'Moyen 3'],
                listOfCategories: [
                    'Alimentation',
                    'Impôts et taxes',
                    'Logistique',
                    'Assurance',
                    'Restaurant et bars',
                    'Équipement et matériel',
                    'Salaire',
                    'Transports',
                    'Marketing',
                    'IT & Electronique',
                    'Autres dépenses',
                ],
            }
        },
        methods: {
            submitForm() {
                this.v$.model.$validate()
                if (!this.v$.model.$invalid) {
                    for (let i = 0; i < this.model[0].files.length; i++) {
                        let form = new FormData()

                        form.append(
                            'file',
                            this.model[0].files[i],
                            (this.model[0].files.length > 1
                                ? this.model[0].docName + '_Partie' + (i + 1)
                                : this.model[0].docName) +
                                '.' +
                                this.model[0].files[i].name.split('.').pop(),
                        )
                    }
                }
            },
        },
    }
</script>
