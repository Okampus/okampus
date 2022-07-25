<template>
    <div class="mx-auto flex h-full w-23/24 gap-4 py-6">
        <ModalPopup :show="filePreview != null" @close="filePreview = null">
            <div class="card flex gap-2">
                <div class="flex items-center justify-center">
                    <DocumentIcon
                        class="h-32 w-32"
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
        </ModalPopup>
        <div class="min-w-1/5 card hidden md:block">
            <FileFolder
                v-if="studyDocFileTree.length > 0"
                title="StudyDocs"
                context="query"
                :children="studyDocFileTree"
                @path="folder = $event"
            />
            <FileFolder
                v-if="infoDocFileTree.length > 0"
                title="InfoDocs"
                context="query"
                :children="infoDocFileTree"
                @path="folder = $event"
            />
        </div>
        <div class="card flex h-full grow flex-col gap-4">
            <div class="flex justify-between">
                <div>
                    <Popper placement="left">
                        <i class="fas fa-sliders-h" />
                        <template #content>
                            <div class="card flex flex-col gap-2">
                                <div>Ordre des dossiers</div>
                                <div class="flex items-center gap-1">
                                    <div
                                        v-for="(filter, i) in filterList"
                                        :key="i"
                                        class="flex items-center gap-1"
                                    >
                                        <div>
                                            {{ filter }}
                                        </div>
                                        <i
                                            v-if="i != filterList.length - 1"
                                            class="fas fa-chevron-right text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Popper>
                </div>
                <div @click="showFilePreview = !showFilePreview">
                    <i class="fas fa-info" />
                </div>
            </div>
            <div class="flex justify-center gap-4">
                <div class="flex cursor-pointer">
                    <div
                        class="raised flex items-center justify-center rounded-l-full pr-3 pl-4 transition"
                        :class="[docStyleList ? 'bg-2' : '']"
                        @click="docStyleList = true"
                    >
                        <i class="fas fa-list" />
                    </div>

                    <div
                        class="raised flex items-center justify-center rounded-r-full pr-4 pl-3 transition"
                        :class="{ 'bg-2': !docStyleList }"
                        @click="docStyleList = false"
                    >
                        <i class="fas fa-th" />
                    </div>
                </div>
                <input
                    class="bg-2 grow rounded-full py-2 px-4"
                    type="text"
                    placeholder="Rechercher un fichier"
                />
                <div class="flex items-center gap-2">
                    <i
                        class="fas fa-download"
                        :class="[filePreview ? 'text-blue-500 cursor-pointer' : '']"
                        @click="
                            $store.dispatch('files/downloadFile', {
                                url: filePreview.file.url,
                                label: filePreview.file.name,
                            })
                        "
                    />
                </div>
            </div>
            <div>
                <FileListPreview
                    v-model:folderList="folder"
                    v-model:filePreview="filePreview"
                    v-model:downloadFileGroup="fileGroup"
                    :file-list="fileList"
                    :preview-by-table="docStyleList"
                ></FileListPreview>
            </div>
        </div>
        <div
            v-if="(filePreview && showFilePreview) || fileGroup.length != 0"
            class="relative hidden w-1/5 md:block"
        >
            <div class="sticky top-4">
                <div class="flex flex-col gap-2">
                    <div v-if="filePreview && showFilePreview" class="card hidden md:block">
                        <div class="flex flex-col gap-2 divide-y">
                            <div class="flex items-center justify-center">
                                <DocumentIcon
                                    class="h-24 w-24"
                                    :mime="filePreview.file.mimeType"
                                    :file-name="filePreview.file.name"
                                />
                            </div>
                            <div class="text-center">
                                <div class="truncate text-lg font-bold">
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
                                <div class="truncate">
                                    {{ file.file.name }}
                                </div>
                                <div class="cursor-pointer" @click.prevent="updateFileGroup(file)">
                                    <i class="fas fa-times text-red-500" />
                                </div>
                            </div>
                            <div class="mt-2 flex w-full items-center justify-center gap-2">
                                <button
                                    class="button-blue flex items-center justify-center gap-2 text-center"
                                    @click="downloadFileGroup"
                                >
                                    <i class="fas fa-arrow-down" />
                                    <div>Télécharger</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import DocumentIcon from '@/components/Document/DocumentIcon.vue'
    import FileFolder from '@/components/Document/FileFolder.vue'
    import FileListPreview from '@/components/Document/FileListPreview.vue'
    import Popper from 'vue3-popper'

    import fileIcon from '@/assets/img/doctype/file.png'

    import _ from 'lodash'
    import formatBytes from '@/utils/formatByteSize'

    export default {
        components: {
            FileFolder,
            FileListPreview,
            ModalPopup,
            DocumentIcon,
            Popper,
        },
        data() {
            return {
                fileIcon,
                docStyleList: true,
                filePreview: null,
                showFilePreview: false,
                fileGroup: [],
                folder: {
                    filters: {},
                    children: [],
                },
                filterList: ['Promotion', 'Matière', 'Cursus', 'Année'],
                fileList: [],
                formatBytes,
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
        },
        watch: {
            folder: {
                handler({ filters }) {
                    if (
                        filters?.query == 'StudyDocs' &&
                        _.difference(['query', 'type', 'year', 'schoolYear', 'subject'], Object.keys(filters))
                            .length == 0
                    ) {
                        this.$store
                            .dispatch('files/newSearchStudyDocs', _.omit(filters, ['query']))
                            .then((val) => {
                                this.fileList = val
                            })
                    } else if (
                        filters?.query == 'InfoDocs' &&
                        _.difference(['query', 'year', 'schoolYear'], Object.keys(filters)).length == 0
                    ) {
                        this.$store
                            .dispatch('files/newSearchInfoDocs', _.omit(filters, ['query']))
                            .then((val) => {
                                this.fileList = val
                            })
                    } else {
                        this.fileList = []
                    }
                },
                deep: true,
            },
        },
        mounted() {
            this.$store.dispatch('files/getStudyDocTree').then(() => {
                if (this.studyDocFileTree.length > 0) {
                    this.folder.children.push({
                        context: 'query',
                        title: 'StudyDocs',
                        children: this.studyDocFileTree,
                        parent: null,
                    })
                }
            })
            this.$store.dispatch('files/getInfoDocTree').then(() => {
                if (this.infoDocFileTree.length > 0) {
                    this.folder.children.push({
                        context: 'query',
                        title: 'InfoDocs',
                        children: this.infoDocFileTree,
                        parent: null,
                    })
                }
            })
        },
        methods: {
            seeDropdown() {
                this.showDropDownFileCard = true
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
