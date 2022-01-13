<template>
    <div class="w-21/24 my-8 mx-auto shadow-md card">
        <MultiStepForm
            v-model="stepAction"
            :steps="steps"
            @previous-step="previousStep"
            @next-step="nextStep"
            @finish="submitForm"
        >
            <template #step1>
                <section>
                    <div class="text-xl py-2">
                        Etape 1
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label for="matiere">Matière</label>
                            <input
                                id="matiere"
                                v-model="stepsModel[0].docSubject"
                                class="input w-full"
                                type="text"
                                placeholder="Quelle est la matière du document"
                                @input="test"
                            >
                        </div>

                        <div>
                            <label for="filiere">Filière</label>
                            <input
                                id="filiere"
                                v-model="stepsModel[0].filiere"
                                class="input w-full"
                                type="text"
                                placeholder="Quelle est la filière associé à ce document"
                            >
                        </div>

                        <div class="flex flex-col">
                            <label for="doc-type">Type de document</label>
                            <SelectInput
                                v-model="stepsModel[0].docType"
                                :choices="['DE', 'CE', 'TD', 'Fiche', 'Projet/TAI', 'Interrogation de TD',
                                           'Cours Efrei', 'Cours eProf', 'DM', 'Notes de cours']"
                            />
                        </div>
                        <div class="flex flex-col">
                            <label for="content">Contenu du dépôt</label>
                            <SelectInput
                                v-model="stepsModel[0].docContent"
                                :choices="['Corrigé', 'Sujet + Corrigé', 'Copie d\'étudiant']"
                            />
                        </div>
                        <div>
                            <label for="promo">Année du document (Promo)</label>
                            <input
                                id="promo"
                                v-model="stepsModel[0].docYear"
                                type="number"
                                placeholder="2025"
                                class="input w-full"
                            >
                        </div>
                    </div>

                    <FileInput
                        v-model="stepsModel[0].files"
                        :img-preview="true"
                        :file-limit="0"
                        class="h-52 w-full mt-4"
                    />
                </section>
            </template>

            <template #step2>
                <section
                    class="space-y-2"
                >
                    <div class="text-xl py-2">
                        Etape 2
                    </div>
                    <input
                        v-model="stepsModel[1].docName"
                        class="input w-full"
                        type="text"
                        placeholder="Complément du nom"
                    >
                    <h4>Description du document </h4>
                    <textarea
                        v-model="stepsModel[1].docDescription"
                        placeholder="Description du document"
                        class="input w-full leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                    />
                </section>
            </template>

            <template #step3>
                <section>
                    <div class="text-xl py-2">
                        Etape 3
                    </div>
                    <p>Disclaimer:</p>
                    <ul class="list-disc">
                        <li>Si vous uploadez un fichier, il sera public et accessible par tous</li>
                        <li>Si vous souhaitez que des informations soient floutées, corrigées ou généralement modifiées, nous vous ferrons une proposition avec des informations sensibles retirées et attendrons votre confirmation avant de rendre le fichier public</li>
                    </ul>
                    <p class="mt-2">
                        Êtes-vous d'accord ?
                    </p>

                    <label>
                        <input
                            v-model="stepsModel[2].modifyDoc"
                            name="radioFile"
                            value="true"
                            type="radio"
                            class="ml-5"
                        >Oui
                    </label>

                    <label>
                        <input
                            v-model="stepsModel[2].modifyDoc"
                            name="radioFile"
                            value="false"
                            type="radio"
                            class="ml-5"
                        >Non
                    </label>
                </section>
            </template>
        </MultiStepForm>
    </div>
</template>

<script lang="js">

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import SelectInput from '@/components/Input/SelectInput.vue'
import FileInput from '@/components/Input/FileInput.vue'
import MultiStepForm from '@/components/Form/MultiStepForm.vue'

export default {
    components: {
        SelectInput,
        FileInput,
        MultiStepForm
    },
    props:{
        steps: {
            type:Array,
            default(){
                return [
                    {
                        id: 'step1',
                        name: 'Informations principales',
                        icon: 'ri-bookmark-line'
                    }, {
                        id: 'step2',
                        name: 'Informations complémentaires',
                        icon: 'ri-user-add-line'
                    }, {
                        id: 'step3',
                        name: 'Finalisation',
                        icon: 'ri-mail-send-line'
                    }
                ]
            }
        }
    },
    setup () {
        return { v$: useVuelidate() }
    },
    validations() {
        return{
            stepsModel:[
                {
                    docSubject: { required },
                    filiere: { required },
                    docType: {  },
                    docContent: {  },
                    docYear: {},
                    files: { required },
                },
                {
                    docName: {  },
                    docDescription: {  },},
                {
                    modifyDoc: { required }
                }
            ]
        }
    },
    data () {
        return {
            filesEndpoint: 'http://localhost:5000/files',
            studyDocsEndpoint: 'http://localhost:5000/files/study-docs',
            show: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',

            stepAction:{
                currentStep: 0,
                nextStep: false,
                previousStep: false
            },
            stepsModel:[
                {
                    docSubject:'',
                    filiere:'',
                    docType:'',
                    docContent:'',
                    docYear: '',
                    files:[],
                },
                {
                    docName:'',
                    docDescription:'',
                },
                {
                    modifyDoc:'false'
                }
            ]
        }
    },
    methods: {
        previousStep(){
            this.stepAction.currentStep -= 1
        },
        nextStep(){
            console.log("next", this.v$.stepsModel[this.stepAction.currentStep].$errors)
            console.log("next", this.v$.stepsModel[this.stepAction.currentStep].$invalid)
            console.log(this.stepsModel[0].files)
            if(!this.v$.stepsModel[this.stepAction.currentStep].$invalid){

                this.stepAction.currentStep += 1
            }
        },
        submitForm(){
            console.log(!this.v$.stepsModel.$invalid)

            if(!this.v$.stepsModel.$invalid){
                for(const el of this.stepsModel[0].files){
                    const data = new FormData()
                    data.append('file', el)
                    data.append('subject',this.stepsModel[0].docSubject)
                    this.$store.dispatch('files/addStudyDoc', data)
                }
            }
        }
    },
}
</script>
