<template>
    <div class="w-21/24 my-8 mx-auto shadow-md card">
        <form-multi-step
            v-model="stepAction"
            :steps="steps"
            @previous-step="previousStep"
            @next-step="nextStep"
            @finish="submitForm"
        >
            <template #step1>
                <section>
                    <div class="space-y-4">
                        <div>
                            <div for="matiere">
                                Matière
                            </div>
                            <div class="w-full">
                                <search-input
                                    v-model="stepsModel[0].docSubject"
                                    class="w-full"
                                    :item-limit="1"
                                    :index-object="{
                                        'subjects':{
                                            queryBy:'code,name,englishName',
                                            queryByWeights: '10, 5, 5'
                                        }
                                    }"
                                >
                                    <template #inputComponent="slotValue">
                                        <div class="flex-grow flex justify-between gap-2 items-center bg-0 rounded-lg p-2">
                                            <div class="text-1 flex items-center gap-2">
                                                <font-awesome-icon
                                                    :icon="iconList(slotValue.item.code)"
                                                    class="text-lg"
                                                />
                                                <div>
                                                    {{ slotValue.item.name }}
                                                </div>
                                                <div class="text-xs text-2">
                                                    {{ slotValue.item.code }}
                                                </div>
                                            </div>
                                            <font-awesome-icon
                                                icon="times"
                                                class="text-red-500 cursor-pointer"
                                                @click="slotValue.deleteItem(slotValue.item)"
                                            />
                                        </div>
                                    </template>
                                    <template #default="slotValue">
                                        <div
                                            class="max-h-24 w-full flex flex-col overflow-y-scroll app-scrollbar"
                                        >
                                            <div
                                                v-for="(item,i) in slotValue.items"
                                                :key="i"
                                                class="flex p-1 gap-2 items-center rounded focus:bg-blue-100 focus:dark:bg-blue-500"
                                                tabindex="0"
                                                @click="slotValue.addItem(
                                                    {
                                                        code:item.code,
                                                        name:item.name,
                                                        desc:item.name,

                                                    })"
                                            >
                                                <font-awesome-icon
                                                    :icon="iconList(item.code)"
                                                    class="text-lg"
                                                />
                                                <div>
                                                    {{ item.name }}
                                                </div>
                                                <div class="text-xs text-2">
                                                    {{ item.code }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </search-input>
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <radio-input
                                v-model="stepsModel[0].cursus"
                                :choices="[
                                    {name:'Tous', key: 'all'},
                                    {name:'Internationale', key: 'int'},
                                    {name:'Renforcé', key: 'renforced'},
                                    {name:'PEx', key: 'pex'},
                                    {name:'Classique', key: 'classic'},
                                ]"
                            />
                        </div>



                        <div class="flex flex-col">
                            <label for="doc-type">Type de document</label>
                            <select-input
                                v-model="stepsModel[0].docType"
                                :choices="['DE', 'CE', 'TD', 'Fiche', 'Projet/TAI', 'Controle Continue',
                                           'Cours Efrei', 'Cours eProf', 'DM', 'Notes de cours']"
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

                    <file-input
                        v-model="stepsModel[0].files"
                        :img-preview="true"
                        :file-limit="-1"
                        class="h-52 w-full mt-4"
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
                </section>
            </template>

            <template #step2>
                <section
                    class="space-y-2"
                >
                    <div>Nom du document</div>
                    <input
                        v-model="stepsModel[1].docName"
                        class="input w-full"
                        type="text"
                        placeholder="Complément du nom"
                    >
                    <div>Description du document </div>

                    <textarea
                        v-model="stepsModel[1].docDescription"
                        placeholder="Description du document"
                        class="input w-full leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                    />

                    <div class="flex flex-col">
                        <label for="content">Contenu du dépôt</label>
                        <select-input
                            v-model="stepsModel[0].docContent"
                            :choices="['Corrigé', 'Sujet + Corrigé', 'Copie d\'étudiant']"
                        />
                    </div>
                </section>
            </template>

            <template #step3>
                <section>
                    <p>Disclaimer:</p>
                    <ul class="list-disc list-inside">
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
        </form-multi-step>
    </div>
</template>

<script lang="js">

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import RadioInput from '@/components/Input/RadioInput.vue'
import SelectInput from '@/components/Input/SelectInput.vue'
import FileInput from '@/components/Input/FileInput.vue'
import FormMultiStep from '@/components/Form/FormMultiStep.vue'
import SearchInput from '@/components/Input/SearchInput.vue'

export default {
    components: {
        RadioInput,
        SelectInput,
        FileInput,
        FormMultiStep,
        SearchInput,
    },
    props: {
        steps: {
            type:Array,
            default(){
                return [
                    {
                        id: 'step1',
                        name: 'UPLOAD',
                        icon: 'file'
                    }, {
                        id: 'step2',
                        name: 'Infos',
                        icon: 'info-circle'
                    }, {
                        id: 'step3',
                        name: 'Envoyer',
                        icon: 'paper-plane'
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
                    cursus: { required },
                    docType: { },
                    docYear: {},
                    files: { required },
                },
                {
                    docContent: {  },
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
                    docSubject:[],
                    cursus:'all',
                    docType:'',
                    docYear: '',
                    files:[],
                },
                {
                    docContent:'',
                    docName:'',
                    docDescription:'',
                },
                {
                    modifyDoc:'false'
                }
            ],

        }

    },
    watch:{
        keyEnter(newVal){
            console.log(newVal)
        }
    },
    methods: {
        iconList(itemCode){
            const iconList = {
                'TI': 'terminal',
                'SM': 'calculator',
                'SB': 'leaf',
                'TE': 'bolt',
                'SP': 'bolt'
            }
            return iconList?.[itemCode.substr(0,2)] ?? 'book'
        },
        previousStep(){
            this.stepAction.currentStep -= 1
        },
        nextStep(){
            if(!this.v$.stepsModel[this.stepAction.currentStep].$invalid){
                this.stepAction.currentStep += 1
            }
        },
        submitForm(){
            if(!this.v$.stepsModel.$invalid){
                for(const el of this.stepsModel[0].files){
                    const data = new FormData()
                    data.append('file', el)
                    data.append('subject',this.stepsModel[0].docSubject[0].code)
                    console.log(this.stepsModel[0].docSubject[0].code)
                    //data.append('cursus', this.stepsModel[0].cursus)
                    this.$store.dispatch('files/addStudyDoc', data).then(
                        () => {
                            this.$router.push('/docs')
                        }
                    )
                }
            }
        }
    }
}
</script>
