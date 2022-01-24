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
        <div class="hidden w-1/5 md:block card">
            <FileFolder
                :folder-name="treeFake.folderName"
                :childrens="treeFake.childrens"
                @path="folderPath = $event"
            />
        </div>
        <div class="flex flex-col grow gap-4 card">
            <div class="group flex justify-between">
                <div class="flex gap-2">
                    <div v-for="(path, i) in folderPath" :key="i" class="">
                        {{ path }}
                        <font-awesome-icon icon="chevron-right" size="xs" />
                    </div>
                </div>

                <div class="invisible group-hover:visible">
                    <Popper placement="left">
                        <font-awesome-icon icon="sliders-h" />
                        <template #content>
                            <div class="flex flex-col gap-2 card">
                                <div>Ordre des dossiers</div>
                                <div class="flex gap-1 items-center">
                                    <div
                                        v-for="(type, i) in folderType"
                                        :key="i"
                                        class="flex gap-1 items-center"
                                    >
                                        <div>
                                            {{ type }}
                                        </div>
                                        <font-awesome-icon
                                            v-if="i != folderType.length - 1"
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
            <div v-if="$store.state.files.studyDocs">
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
                            v-for="(file, i) in $store.state.files.studyDocs"
                            :key="i"
                            class="group w-full"
                            :class="[file == filePreview ? 'bg-2' : '']"
                            @click="setFilePreview(file)"
                        >
                            <td class="p-2 pl-4 rounded-l-xl">
                                <div class="flex gap-2">
                                    <div class="flex justify-center items-center">
                                        <input
                                            :class="[
                                                fileGroup.length == 0 ? 'invisible group-hover:visible' : '',
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
                    </tbody>
                </table>
                <div v-else class="relative">
                    <div class="font-bold pb">Study Docs</div>
                    <hr class="py-2" />

                    <div class="grid grid-cols-6 auto-rows-min gap-4">
                        <div
                            v-for="(file, i) in $store.state.files.studyDocs"
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
                                            class="flex gap-2 justify-center items-center py-2 px-4 rounded-xl"
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
                    <div v-if="fileGroup.length > 1" class="card">
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
                                    <div>
                                        <font-awesome-icon icon="arrow-down" />
                                        Télécharger
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
import { treeFake } from '@/fake/tree.js'
import filesService from '@/services/files.service'
import formatBytes from '@/utils/formatByteSize'
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
            filesFilters: [],
            docStyleList: true,
            filePreview: null,
            showFile: false,
            fileGroup: [],
            folderPath: ['Main'],
            folderType: ['Promotion', 'Matière', 'Cursus', 'Année'],
            Date,
            treeFake,
        }
    },
    mounted() {
        this.$store.dispatch('files/getStudyDocs')
    },
    methods: {
        dropDownButtons(studyDoc) {
            return [
                {
                    name: 'Télécharger',
                    icon: 'arrow-down',
                    class: 'hover:bg-green-500 hover:text-white',
                    action: () => {
                        filesService.downloadFile({
                            query: studyDoc.file.fileUploadId,
                            label: studyDoc.file.name,
                        })
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
                filesService.downloadFile({
                    query: el.file.fileUploadId,
                    label: el.file.name,
                })
            }
            this.fileGroup = []
        },
    },
}
</script>
