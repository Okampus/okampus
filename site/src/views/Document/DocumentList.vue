<template>
    <div class="flex gap-4 my-6 mx-auto w-23/24">
        <AppModal
            :show="filePreview != null"
            :global-custom-class="'block md:hidden'"
            @close="filePreview = null"
        >
            <div class="flex gap-2 card">
                <div class="flex justify-center items-center">
                    <DocumentIcon
                        class="w-32 h-32"
                        :mime="filePreview.file.mimeType"
                        :file-name="filePreview.file.name"
                    />
                </div>
                <div class="">
                    <div class="text-xl font-bold">
                        {{ filePreview.file.name }}
                    </div>
                    <div class="text-sm">
                        {{ new Date(filePreview.createdAt).toLocaleDateString() }}
                    </div>
                    <div class="text-sm">
                        {{ formatBytes(filePreview.file.fileSize) }}
                    </div>
                </div>
            </div>
        </AppModal>
        <div class="hidden md:block min-w-1/5 card">
            <FileFolder
                v-if="studyDocFileTree.length > 0"
                title="StudyDocs"
                context="query"
                :children="studyDocFileTree"
                @path=";(fileFilter = $event.filters), (folderChildren = $event.children)"
            />
            <FileFolder
                v-if="infoDocFileTree.length > 0"
                title="InfoDocs"
                context="query"
                :children="infoDocFileTree"
                @path=";(fileFilter = $event.filters), (folderChildren = $event.children)"
            />
        </div>
        <div class="flex flex-col grow gap-4 card">
            <div class="group flex justify-between">
                <div>
                    <Popper placement="left">
                        <font-awesome-icon icon="sliders-h" />
                        <template #content>
                            <div class="flex flex-col gap-2 card">
                                <div>Ordre des dossiers</div>
                                <div class="flex gap-1 items-center">
                                    <div
                                        v-for="(filter, i) in filterList"
                                        :key="i"
                                        class="flex gap-1 items-center"
                                    >
                                        <div>
                                            {{ filter }}
                                        </div>
                                        <font-awesome-icon
                                            v-if="i != filterList.length - 1"
                                            icon="chevron-right"
                                            size="xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Popper>
                </div>
            </div>
            <div class="flex gap-4 justify-center">
                <div class="flex cursor-pointer">
                    <div
                        class="flex justify-center items-center pr-3 pl-4 rounded-l-full transition raised"
                        :class="[docStyleList ? 'bg-2' : '']"
                        @click="docStyleList = true"
                    >
                        <font-awesome-icon icon="list" />
                    </div>

                    <div
                        class="flex justify-center items-center pr-4 pl-3 rounded-r-full transition raised"
                        :class="{ 'bg-2': !docStyleList }"
                        @click="docStyleList = false"
                    >
                        <font-awesome-icon icon="th" />
                    </div>
                </div>
                <input
                    class="grow py-2 px-4 rounded-full bg-2"
                    type="text"
                    placeholder="Rechercher un fichier"
                />
                <div class="flex gap-2 items-center">
                    <font-awesome-icon
                        icon="arrow-down"
                        :class="[fileGroup.length > 0 ? 'text-blue-500 cursor-pointer' : '']"
                    />
                </div>
            </div>
            <div>
                <table v-if="docStyleList" class="w-full text-center table-auto">
                    <thead>
                        <tr>
                            <th />
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Taille</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(folder, i) in folderChildren"
                            :key="i"
                            class="hover:bg-2-light hover:dark:bg-2-dark cursor-pointer"
                            @click="
                                ;(folderChildren = folder.children),
                                    (fileFilter[folder.context] = folder.title)
                            "
                        >
                            <td class="p-2 pl-4 rounded-l-xl">
                                <font-awesome-icon size="2x" icon="folder"></font-awesome-icon>
                            </td>
                            <td class="p-2">
                                <div class="flex justify-center items-center">
                                    {{ contextList[folder.context](folder.title) }}
                                </div>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="pr-4 rounded-r-xl"></td>
                        </tr>
                        <template
                            v-if="Object.keys(fileFilter).length == 5 && fileFilter?.query == 'StudyDocs'"
                        >
                            <tr
                                v-for="(file, i) in studyDocList"
                                :key="i"
                                class="group hover:bg-2-light hover:dark:bg-2-dark cursor-pointer"
                                :class="[file == filePreview ? 'bg-2' : '']"
                                @click="setFilePreview(file)"
                            >
                                <td class="p-2 pl-4 rounded-l-xl">
                                    <div class="flex gap-2 items-center">
                                        <div class="flex justify-center items-center">
                                            <input
                                                :class="[
                                                    fileGroup.length == 0
                                                        ? 'invisible group-hover:visible'
                                                        : '',
                                                ]"
                                                class="hidden md:block"
                                                type="checkbox"
                                                :checked="fileGroup.includes(file)"
                                                @click="updateFileGroup(file)"
                                            />
                                        </div>

                                        <div class="flex relative justify-center items-center">
                                            <DocumentIcon
                                                class="w-8 h-8"
                                                :mime="file.file.mimeType"
                                                :file-name="file.file.name"
                                            />
                                            <div
                                                v-if="file.file.user.roles.includes('moderator')"
                                                class="absolute -top-3 right-0"
                                            >
                                                <Popper :hover="true" :arrow="true">
                                                    <font-awesome-icon
                                                        class="text-blue-500 cursor-auto"
                                                        icon="certificate"
                                                        size="xs"
                                                    ></font-awesome-icon>
                                                    <template #content>
                                                        <div
                                                            class="p-2 px-3 whitespace-nowrap rounded shadow-lg bg-1"
                                                        >
                                                            Partagé par un prof
                                                        </div>
                                                    </template>
                                                </Popper>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-2">
                                    <div class="flex justify-center items-center">
                                        {{ file.file.name }}
                                    </div>
                                </td>
                                <td>
                                    <div class="flex justify-center items-center">
                                        {{ file.file.fileKind }}
                                    </div>
                                </td>
                                <td class="p-2">
                                    <div class="flex justify-center items-center">
                                        {{ new Date(file.createdAt).toLocaleDateString() }}
                                    </div>
                                </td>
                                <td class="p-2">
                                    <div class="flex justify-center items-center">
                                        {{ formatBytes(file.file.fileSize) }}
                                    </div>
                                </td>
                                <td class="pr-4 rounded-r-xl">
                                    <div
                                        class="flex invisible group-hover:visible justify-center items-center hover:cursor-pointer"
                                    >
                                        <DropDownInput :buttons="dropDownButtons(file)">
                                            <font-awesome-icon icon="ellipsis-h" />
                                        </DropDownInput>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template
                            v-if="Object.keys(fileFilter).length == 3 && fileFilter?.query == 'InfoDocs'"
                        >
                            <tr
                                v-for="(file, i) in infoDocList"
                                :key="i"
                                class="group hover:bg-2-light hover:dark:bg-2-dark cursor-pointer"
                                :class="[file == filePreview ? 'bg-2' : '']"
                                @click="setFilePreview(file)"
                            >
                                <td class="p-2 pl-4 rounded-l-xl">
                                    <div class="flex gap-2">
                                        <div class="flex justify-center items-center">
                                            <input
                                                :class="[
                                                    fileGroup.length == 0
                                                        ? 'invisible group-hover:visible'
                                                        : '',
                                                ]"
                                                class="hidden md:block"
                                                type="checkbox"
                                                :checked="fileGroup.includes(file)"
                                                @click="updateFileGroup(file)"
                                            />
                                        </div>
                                        <div class="flex justify-center items-center">
                                            <DocumentIcon
                                                class="w-8 h-8"
                                                :mime="file.file.mimeType"
                                                :file-name="file.file.name"
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td class="p-2">
                                    <div class="flex justify-center items-center">
                                        {{ file.file.name }}
                                    </div>
                                </td>
                                <td>
                                    <div class="flex justify-center items-center">
                                        {{ file.file.fileKind }}
                                    </div>
                                </td>
                                <td class="p-2">
                                    <div class="flex justify-center items-center">
                                        {{ new Date(file.createdAt).toLocaleDateString() }}
                                    </div>
                                </td>
                                <td class="p-2">
                                    <div class="flex justify-center items-center">
                                        {{ formatBytes(file.file.fileSize) }}
                                    </div>
                                </td>
                                <td class="pr-4 rounded-r-xl">
                                    <div
                                        class="flex invisible group-hover:visible justify-center items-center hover:cursor-pointer"
                                    >
                                        <DropDownInput :buttons="dropDownButtons(file)">
                                            <font-awesome-icon icon="ellipsis-h" />
                                        </DropDownInput>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div v-else class="relative">
                    <div class="font-bold pb">Study Docs</div>
                    <hr class="py-2" />

                    <div class="grid grid-cols-6 auto-rows-min gap-4">
                        <div
                            v-for="(folder, i) in folderChildren"
                            :key="i"
                            class="group flex relative flex-col gap-1 justify-center items-center rounded cursor-pointer"
                            @click="
                                ;(folderChildren = folder.children),
                                    (fileFilter[folder.context] = folder.title)
                            "
                        >
                            <div class="flex flex-col gap-1 justify-center items-center">
                                <font-awesome-icon size="3x" icon="folder"></font-awesome-icon>
                                <div class="w-full text-sm text-center truncate">
                                    {{ contextList[folder.context](folder.title) }}
                                </div>
                            </div>
                        </div>
                        <template
                            v-if="Object.keys(fileFilter).length == 3 && fileFilter?.query == 'InfoDocs'"
                        >
                            <div
                                v-for="(file, i) in infoDocList"
                                :key="i"
                                class="group flex relative flex-col gap-1 justify-center items-center rounded hover:bg-2"
                            >
                                <input
                                    type="checkbox"
                                    class="hidden absolute top-0 left-0 md:block"
                                    :class="[fileGroup.length == 0 ? 'invisible group-hover:visible' : '']"
                                    :checked="fileGroup.includes(file)"
                                    @click="updateFileGroup(file)"
                                />
                                <Popper :offset-distance="'0'" :interactive="false">
                                    <div
                                        class="flex flex-col gap-1 justify-center items-center"
                                        @click="setFilePreview(file)"
                                    >
                                        <DocumentIcon
                                            class="w-12 h-12"
                                            :mime="file.file.mimeType"
                                            :file-name="file.file.name"
                                        />
                                        <div class="w-full text-sm text-center truncate">
                                            {{ file.file.name }}
                                        </div>
                                    </div>

                                    <template #content>
                                        <div class="flex flex-col p-2 card">
                                            <div
                                                v-for="(button, index) in dropDownButtons(file)"
                                                :key="index"
                                                class="flex gap-2 justify-center items-center py-2 px-4 hover:text-white rounded-xl"
                                                :class="button.class"
                                                @click="button.action()"
                                            >
                                                <font-awesome-icon :icon="button.icon" />
                                                <p>{{ button.name }}</p>
                                            </div>
                                        </div>
                                    </template>
                                </Popper>
                            </div>
                        </template>
                        <template
                            v-if="Object.keys(fileFilter).length == 5 && fileFilter?.query == 'StudyDocs'"
                        >
                            <div
                                v-for="(file, i) in studyDocList"
                                :key="i"
                                class="group flex relative flex-col gap-1 justify-center items-center rounded hover:bg-2"
                            >
                                <input
                                    type="checkbox"
                                    class="hidden absolute top-0 left-0 md:block"
                                    :class="[fileGroup.length == 0 ? 'invisible group-hover:visible' : '']"
                                    :checked="fileGroup.includes(file)"
                                    @click="updateFileGroup(file)"
                                />
                                <Popper :offset-distance="'0'" :interactive="false">
                                    <div
                                        class="flex flex-col gap-1 justify-center items-center"
                                        @click="setFilePreview(file)"
                                    >
                                        <DocumentIcon
                                            class="w-12 h-12"
                                            :mime="file.file.mimeType"
                                            :file-name="file.file.name"
                                        />
                                        <div class="w-full text-sm text-center truncate">
                                            {{ file.file.name }}
                                        </div>
                                    </div>

                                    <template #content>
                                        <div class="flex flex-col p-2 card">
                                            <div
                                                v-for="(button, index) in dropDownButtons(file)"
                                                :key="index"
                                                class="flex gap-2 justify-center items-center py-2 px-4 hover:text-white rounded-xl"
                                                :class="button.class"
                                                @click="button.action()"
                                            >
                                                <font-awesome-icon :icon="button.icon" />
                                                <p>{{ button.name }}</p>
                                            </div>
                                        </div>
                                    </template>
                                </Popper>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="filePreview || fileGroup.length != 0" class="hidden relative w-1/5 md:block">
            <div class="sticky top-4">
                <div class="flex flex-col gap-2">
                    <div v-if="filePreview" class="hidden md:block card">
                        <div class="flex flex-col gap-2 divide-y">
                            <div class="flex justify-center items-center">
                                <DocumentIcon
                                    class="w-24 h-24"
                                    :mime="filePreview.file.mimeType"
                                    :file-name="filePreview.file.name"
                                />
                            </div>
                            <div class="text-center">
                                <div class="text-lg font-bold">
                                    {{ filePreview.file.name }}
                                </div>
                                <div class="text-sm">
                                    {{ new Date(filePreview.createdAt).toLocaleDateString() }}
                                </div>
                                <div class="text-sm">
                                    {{ formatBytes(filePreview.file.fileSize) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="fileGroup.length > 0" class="card">
                        <div class="flex flex-col gap-2">
                            <div class="font-bold">
                                {{ fileGroup.length }} fichier{{ fileGroup.length > 1 ? 's' : '' }}
                            </div>
                            <div v-for="(file, i) in fileGroup" :key="i" class="flex justify-between">
                                <div>
                                    {{ file.file.name }}
                                </div>
                                <div class="cursor-pointer" @click.prevent="updateFileGroup(file)">
                                    <font-awesome-icon icon="times" class="text-red-500" />
                                </div>
                            </div>
                            <div class="flex gap-2 justify-center items-center mt-2 w-full">
                                <div class="text-center button" @click="downloadFileGroup">
                                    <div class="flex gap-2 justify-center items-center">
                                        <font-awesome-icon icon="arrow-down" />
                                        <div>Télécharger</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import fileIcon from '@/assets/img/doctype/file.png'
    import AppModal from '@/components/App/AppModal.vue'
    import DocumentIcon from '@/components/Document/DocumentIcon.vue'
    import FileFolder from '@/components/Document/FileFolder.vue'
    import DropDownInput from '@/components/Input/DropDownInput.vue'
    import formatBytes from '@/utils/formatByteSize'
    import _ from 'lodash'
    import Popper from 'vue3-popper'
    export default {
        components: {
            FileFolder,
            DropDownInput,
            AppModal,
            DocumentIcon,
            Popper,
        },
        data() {
            return {
                fileIcon,
                formatBytes,
                docStyleList: true,
                filePreview: null,
                fileGroup: [],
                fileFilter: {},
                folderChildren: [],
                contextList: {
                    schoolYear: (val) => ['L1', 'L2', 'L3', 'M1', 'M2'][val],
                    subject: (val) => val,
                    type: (val) => val,
                    year: (val) => val,
                    query: (val) => val,
                },
                filterList: ['Promotion', 'Matière', 'Cursus', 'Année'],

                Date,
            }
        },
        computed: {
            infoDocFileTree() {
                return this.$store.state.files.infoDocFileTree
            },
            studyDocFileTree() {
                return this.$store.state.files.studyDocFileTree
            },
            studyDocList() {
                return this.$store.state.files.studyDocList
            },
            infoDocList() {
                return this.$store.state.files.infoDocList
            },
        },
        watch: {
            fileFilter: {
                handler(newVal) {
                    if (
                        newVal.query == 'StudyDocs' &&
                        _.difference(['query', 'type', 'year', 'schoolYear', 'subject'], Object.keys(newVal))
                            .length == 0
                    ) {
                        this.$store.dispatch('files/newSearchStudyDocs', _.omit(newVal, ['query']))
                    } else if (
                        newVal.query == 'InfoDocs' &&
                        _.difference(['query', 'year', 'schoolYear'], Object.keys(newVal)).length == 0
                    ) {
                        this.$store.dispatch('files/newSearchInfoDocs', _.omit(newVal, ['query']))
                    }
                },
                deep: true,
            },
        },
        mounted() {
            this.$store.dispatch('files/getStudyDocTree').then(() => {
                if (this.studyDocFileTree.length > 0) {
                    this.folderChildren.push({
                        context: 'query',
                        title: 'StudyDocs',
                        children: this.studyDocFileTree,
                    })
                }
            })
            this.$store.dispatch('files/getInfoDocTree').then(() => {
                if (this.infoDocFileTree.length > 0) {
                    this.folderChildren.push({
                        context: 'query',
                        title: 'InfoDocs',
                        children: this.infoDocFileTree,
                    })
                }
            })
        },
        methods: {
            dropDownButtons(studyDoc) {
                return [
                    {
                        name: 'Télécharger',
                        icon: 'arrow-down',
                        class: 'hover:bg-green-500 hover:text-white',
                        action: () => {
                            console.log(studyDoc)
                            this.$store.dispatch('files/downloadFile', {
                                url: studyDoc.file.url,
                                label: studyDoc.file.name,
                            })
                        },
                    },
                    {
                        name: 'Voir',
                        icon: 'eye',
                        class: 'hover:bg-green-500 hover:text-white',
                        action: () => {
                            window.open(studyDoc.file.url, '_blank').focus()
                        },
                    },
                    {
                        name: 'Copier le lien',
                        icon: 'link',
                        class: 'hover:bg-blue-500 hover:text-white',
                        action: () => {
                            navigator.clipboard.writeText(studyDoc.file.url)
                        },
                    },
                    {
                        name: 'Supprimer',
                        icon: 'times',
                        class: 'hover:bg-red-500 hover:text-white',
                        // TODO: delete ("archive") file
                        action: () => {
                            console.log('Delete (placeholder)', studyDoc)
                        },
                    },
                ]
            },
            seeDropdown() {
                this.showDropDownFileCard = true
            },
            setFilePreview(file) {
                this.filePreview = file
            },
            updateFileGroup(file) {
                if (this.fileGroup.includes(file)) {
                    this.fileGroup = this.fileGroup.filter((f) => f != file)
                } else {
                    this.fileGroup.push(file)
                }
            },
            downloadFileGroup() {
                for (const el of this.fileGroup) {
                    this.$store.dispatch('files/downloadFile', {
                        url: el.file.url,
                        label: el.file.name,
                    })
                }
                this.fileGroup = []
            },
        },
    }
</script>
