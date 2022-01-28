<template>
    <div class="my-8 mx-auto w-21/24 shadow-md card">
        <FormMultiStep
            v-model="stepAction"
            :steps="steps"
            @previous-step="previousStep"
            @next-step="nextStep"
            @finish="submitForm"
        >
            <template #step1>
                <section class="flex flex-col gap-4">
                    <RadioInput
                        v-model="stepsModel[0].docType"
                        :choices="[
                            { name: 'Scolaire', key: 'studyDoc' },
                            { name: 'Informatif', key: 'infoDoc' },
                        ]"
                    />
                    <div>
                        <label
                            >Nom du document<span class="text-red-500">*</span>
                            <input
                                v-model="stepsModel[0].docName"
                                class="w-full input"
                                :class="{ 'ring-2 ring-red-500': v$.stepsModel[0].docName.$error }"
                                type="text"
                                placeholder="Nom du document"
                            />
                        </label>
                        <div v-if="v$.stepsModel[0].docName.$error" class="flex flex-col">
                            <AppAlert
                                v-for="(error, i) in v$.stepsModel[0].docName.$errors"
                                :key="i"
                                type="error"
                            >
                                <template #text>
                                    <div class="subtitle">
                                        {{ error.$message }}
                                    </div>
                                </template>
                            </AppAlert>
                        </div>
                    </div>

                    <div>
                        <label
                            >Description du document
                            <textarea
                                v-model="stepsModel[0].docDescription"
                                placeholder="Description du document"
                                class="w-full leading-tight focus:outline-none input focus:shadow-outline"
                                type="text"
                                rows="5"
                            />
                        </label>
                    </div>

                    <div>
                        <FileInput
                            v-model="stepsModel[0].files"
                            :img-preview="true"
                            :file-limit="-1"
                            class="mt-4 w-full h-52 rounded"
                            :class="{ 'ring-2 ring-red-500': v$.stepsModel[0].files.$error }"
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
                        <div v-if="v$.stepsModel[0].files.$error" class="flex flex-col">
                            <AppAlert
                                v-for="(error, i) in v$.stepsModel[0].files.$errors"
                                :key="i"
                                type="error"
                            >
                                <template #text>
                                    <div class="subtitle">
                                        {{ error.$message }}
                                    </div>
                                </template>
                            </AppAlert>
                        </div>
                    </div>
                    {{ v$.stepsModel[1].docType }}
                </section>
            </template>

            <template #step2>
                <section class="flex flex-col gap-4">
                    <div>
                        <label for="promo"
                            >Année du document<span class="text-red-500">*</span>
                            <input
                                id="promo"
                                v-model="stepsModel[1].docYear"
                                :class="{ 'ring-2 ring-red-500': v$.stepsModel[1].docYear.$error }"
                                type="number"
                                placeholder="2025"
                                class="w-full input"
                            />
                        </label>
                        <div v-if="v$.stepsModel[1].docYear.$error" class="flex flex-col">
                            <AppAlert
                                v-for="(error, i) in v$.stepsModel[1].docYear.$errors"
                                :key="i"
                                type="error"
                            >
                                <template #text>
                                    <div class="subtitle">
                                        {{ error.$message }}
                                    </div>
                                </template>
                            </AppAlert>
                        </div>
                    </div>
                    <div v-if="stepsModel[0].docType == 'studyDoc'" class="flex flex-col gap-4">
                        <div>
                            <div for="matiere">Matière<span class="text-red-500">*</span></div>
                            <div class="w-full">
                                <SearchInput
                                    v-model="stepsModel[1].docSubject"
                                    class="w-full rounded"
                                    :item-limit="1"
                                    :class="{ 'ring-2 ring-red-500': v$.stepsModel[1].docSubject.$error }"
                                    :index-object="{
                                        'subjects': {
                                            queryBy: 'code,name,englishName',
                                            queryByWeights: '10, 5, 5',
                                        },
                                    }"
                                >
                                    <template #inputComponent="slotValue">
                                        <div
                                            class="flex grow gap-2 justify-between items-center p-2 rounded-lg bg-0"
                                        >
                                            <div class="flex gap-2 items-center text-1">
                                                <font-awesome-icon
                                                    :icon="iconList(slotValue.item.code)"
                                                    class="text-lg"
                                                />
                                                <div>
                                                    {{ subjectYear[slotValue.item.schoolYear] }}
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
                                            class="flex overflow-y-scroll flex-col w-full max-h-24 app-scrollbar"
                                        >
                                            <div
                                                v-for="(item, i) in slotValue.items"
                                                :key="i"
                                                class="flex gap-2 items-center p-1 focus:bg-blue-100 focus:dark:bg-blue-500 rounded"
                                                tabindex="0"
                                                @click="
                                                    slotValue.addItem({
                                                        code: item.code,
                                                        name: item.name,
                                                        desc: item.name,
                                                    })
                                                "
                                            >
                                                <font-awesome-icon
                                                    :icon="iconList(item.code)"
                                                    class="text-lg"
                                                />
                                                <div>
                                                    {{ subjectYear[item.schoolYear] }}
                                                    {{ item.name }}
                                                </div>
                                                <div class="text-xs text-2">
                                                    {{ item.code }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </SearchInput>
                            </div>
                            <div v-if="v$.stepsModel[1].docSubject.$error" class="flex flex-col">
                                <AppAlert
                                    v-for="(error, i) in v$.stepsModel[1].docSubject.$errors"
                                    :key="i"
                                    type="error"
                                >
                                    <template #text>
                                        <div class="subtitle">
                                            {{ error.$message }}
                                        </div>
                                    </template>
                                </AppAlert>
                            </div>
                        </div>
                        <RadioInput
                            v-model="stepsModel[1].docCursus"
                            :choices="[
                                { name: 'Tous', key: 'all' },
                                { name: 'Internationale', key: 'int' },
                                { name: 'Renforcé', key: 'renforced' },
                                { name: 'PEx', key: 'pex' },
                                { name: 'Classique', key: 'classic' },
                            ]"
                        />
                        <div>
                            <div for="doc-type">Type de document<span class="text-red-500">*</span></div>
                            <SelectInput
                                v-model="stepsModel[1].docContent"
                                :choices="[
                                    'examDE',
                                    'examCE',
                                    'examCC',
                                    'examDM',
                                    'course',
                                    'sheet',
                                    'projects',
                                    'efreiClass',
                                    'eprofClass',
                                    'classNote',
                                    'other',
                                ]"
                            />
                            <div v-if="v$.stepsModel[1].docContent.$error" class="flex flex-col">
                                <AppAlert
                                    v-for="(error, i) in v$.stepsModel[1].docContent.$errors"
                                    :key="i"
                                    type="error"
                                >
                                    <template #text>
                                        <div class="subtitle">
                                            {{ error.$message }}
                                        </div>
                                    </template>
                                </AppAlert>
                            </div>
                        </div>
                        <div
                            v-if="
                                ['examDE', 'examCE', 'examCC', 'examDM', 'examTAI'].includes(
                                    [
                                        'examDE',
                                        'examCE',
                                        'examCC',
                                        'examDM',
                                        'course',
                                        'sheet',
                                        'projects',
                                        'efreiClass',
                                        'eprofClass',
                                        'classNote',
                                        'other',
                                    ][stepsModel[1].docContent],
                                )
                            "
                            class="flex flex-col"
                        >
                            <div for="content">Contenu du dépôt<span class="text-red-500">*</span></div>
                            <SelectInput
                                v-model="stepsModel[1].docFlags"
                                :choices="['Sujet', 'Corrigé', 'Sujet + Corrigé', 'Copie d\'étudiant']"
                            />
                            <div v-if="v$.stepsModel[1].docFlags.$error" class="flex flex-col">
                                <AppAlert
                                    v-for="(error, i) in v$.stepsModel[1].docFlags.$errors"
                                    :key="i"
                                    type="error"
                                >
                                    <template #text>
                                        <div class="subtitle">
                                            {{ error.$message }}
                                        </div>
                                    </template>
                                </AppAlert>
                            </div>
                        </div>
                    </div>
                    <div v-if="stepsModel[0].docType == 'infoDoc'">
                        <div>
                            <div for="doc-type">Promo<span class="text-red-500">*</span></div>
                            <SelectInput
                                v-model="stepsModel[1].docSchoolYear"
                                :choices="['L1', 'L2', 'L3', 'M1', 'M2']"
                            />
                            <div v-if="v$.stepsModel[1].docSchoolYear.$error" class="flex flex-col">
                                <AppAlert
                                    v-for="(error, i) in v$.stepsModel[1].docSchoolYear.$errors"
                                    :key="i"
                                    type="error"
                                >
                                    <template #text>
                                        <div class="subtitle">
                                            {{ error.$message }}
                                        </div>
                                    </template>
                                </AppAlert>
                            </div>
                        </div>
                    </div>
                </section>
            </template>

            <template #step3>
                <section class="flex flex-col gap-4">
                    <div>
                        <p>Disclaimer:</p>
                        <ul class="list-disc list-inside">
                            <li>Si vous uploadez un fichier, il sera public et accessible par tous</li>
                            <li>
                                Si vous souhaitez que des informations soient floutées, corrigées ou
                                généralement modifiées, nous vous ferrons une proposition avec des
                                informations sensibles retirées et attendrons votre confirmation avant de
                                rendre le fichier public
                            </li>
                        </ul>
                    </div>
                    <label class="flex gap-2 items-center">
                        <input
                            v-model="stepsModel[2].acceptCondition"
                            name="radioFile"
                            :value="false"
                            type="checkbox"
                            :class="{ 'ring-2 ring-red-500': v$.stepsModel[2].acceptCondition.$error }"
                        />
                        Je suis d'accord<span class="text-red-500">*</span>
                    </label>
                    <div v-if="v$.stepsModel[2].acceptCondition.$error" class="flex flex-col">
                        <AppAlert
                            v-for="(error, i) in v$.stepsModel[2].acceptCondition.$errors"
                            :key="i"
                            type="error"
                        >
                            <template #text>
                                <div class="subtitle">
                                    {{ error.$message }}
                                </div>
                            </template>
                        </AppAlert>
                    </div>
                </section>
            </template>
        </FormMultiStep>
    </div>
</template>

<script lang="js">

    import AppAlert from '@/components/App/AppAlert.vue'
    import FormMultiStep from '@/components/Form/FormMultiStep.vue'
    import FileInput from '@/components/Input/FileInput.vue'
    import RadioInput from '@/components/Input/RadioInput.vue'
    import SearchInput from '@/components/Input/SearchInput.vue'
    import SelectInput from '@/components/Input/SelectInput.vue'
    import useVuelidate from '@vuelidate/core'
    import {
        integer, maxLength, required, requiredIf, sameAs,
    } from '@vuelidate/validators'


    export default {
        components: {
            RadioInput,
            SelectInput,
            FileInput,
            FormMultiStep,
            SearchInput,
            AppAlert,
        },
        props: {
            steps: {
                type: Array,
                default() {
                    return [
                        {
                            id: 'step1',
                            name: 'Upload',
                            icon: 'file',
                        }, {
                            id: 'step2',
                            name: 'Infos',
                            icon: 'info-circle',
                        }, {
                            id: 'step3',
                            name: 'Envoyer',
                            icon: 'paper-plane',
                        },
                    ]
                },
            },
        },
        setup () {
            return { v$: useVuelidate() }
        },
        validations() {
            return {
                stepsModel: [
                    {
                        files: { required },
                        docName: {
                            required,

                            maxLength: maxLength(20),
                        },
                        docDescription: {  },
                    },
                    {
                        docSubject: { requiredIf: requiredIf(this.stepsModel[0].docType == 'studyDoc') },
                        docCursus: { requiredIf: requiredIf( this.stepsModel[0].docType == 'studyDoc') },
                        docYear: {
                            required,
                            integer,
                        },
                        docContent: { requiredIf: requiredIf( this.stepsModel[0].docType == 'studyDoc') },
                        docFlags: {
                            requiredIf: requiredIf( this.stepsModel[0].docType == 'studyDoc' &&
                                ['examDE','examCE','examCC', 'examDM', 'examTAI'].includes([
                                    'examDE',
                                    'examCE',
                                    'examCC',
                                    'examDM',
                                    'course',
                                    'sheet',
                                    'projects',
                                    'efreiClass',
                                    'eprofClass',
                                    'classNote',
                                    'other',
                                ]
                                    [this.stepsModel[1].docContent])),

                        },
                        docSchoolYear: { requiredIf: requiredIf( this.stepsModel[0].docType == 'infoDoc') },
                    },
                    { acceptCondition: { sameAs: sameAs(true) } },
                ],
            }
        },
        data () {
            return {
                stepAction: {
                    currentStep: 0,
                    nextStep: false,
                    previousStep: false,
                },
                stepsModel: [
                    {
                        docType: 'studyDoc',
                        files: [],
                        docName: '',
                        docDescription: '',
                    },
                    {
                        docSubject: [],
                        docCursus: 'all',
                        docYear: '',
                        docContent: '',
                        docFlags: '',
                        docSchoolYear: '',
                    },
                    { acceptCondition: false },
                ],
                subjectYear: ['L1','L2', 'L3', 'M1', 'M2'],
            }
        },
        methods: {
            iconList(itemCode) {
                const iconList = {
                    'TI': 'terminal',
                    'SM': 'calculator',
                    'SB': 'leaf',
                    'TE': 'bolt',
                    'SP': 'bolt',
                }
                return iconList?.[itemCode.substr(0,2)] ?? 'book'
            },
            previousStep() {
                this.stepAction.currentStep -= 1
            },
            nextStep() {
                this.v$.stepsModel[this.stepAction.currentStep].$validate()
                console.log(this.v$.stepsModel[this.stepAction.currentStep].$errors)
                if (!this.v$.stepsModel[this.stepAction.currentStep].$invalid) {
                    this.stepAction.currentStep += 1
                }
            },
            submitForm() {
                this.v$.stepsModel.$validate()
                if (!this.v$.stepsModel.$invalid) {
                    for (let i=0;i<this.stepsModel[0].files.length;i++) {
                        let form = new FormData()

                        form.append('file', this.stepsModel[0].files[i], (this.stepsModel[0].files.length>1 ? this.stepsModel[0].docName+'_Partie'+(i+1) : this.stepsModel[0].docName)+'.'+this.stepsModel[0].files[i].name.split('.').pop() )
                        form.append('description', this.stepsModel[0].docDescription)
                        form.append('year', this.stepsModel[1].docYear)

                        if (this.stepsModel[0].docType == 'studyDoc') {
                            form.append('subject',this.stepsModel[1].docSubject[0].code)
                            form.append('cursus',this.stepsModel[1].docCursus)
                            form.append('type',[
                                'examDE',
                                'examCE',
                                'examCC',
                                'examDM',
                                'course',
                                'sheet',
                                'projects',
                                'efreiClass',
                                'eprofClass',
                                'classNote',
                                'other',
                            ][this.stepsModel[1].docContent])
                            if (['examDE','examCE','examCC', 'examDM', 'examTAI'].includes([
                                'examDE',
                                'examCE',
                                'examCC',
                                'examDM',
                                'course',
                                'sheet',
                                'projects',
                                'efreiClass',
                                'eprofClass',
                                'classNote',
                                'other',
                            ][this.stepsModel[1].docContent])) {
                                form.append('flags',1)
                            }
                            this.$store.dispatch('files/addStudyDoc', form).then(
                                () => {
                                    this.$router.push('/docs')
                                },
                            )
                        } else {
                            form.append('schoolYear', this.stepsModel[1].docSchoolYear)
                            this.$store.dispatch('files/addInfoDoc', form).then(
                                () => {
                                    this.$router.push('/docs')
                                },
                            )
                        }
                    }
                }
            },
        },
    }
</script>
