<template>
    <div class="w-21/24 flex gap-4 mx-auto my-6">
        <CustomModal
            :show="filePreview != null"
            :custom-class="'block md:hidden'"
            @close="filePreview = null"
        >
            <div class="card w-3/4">
                {{ filePreview }}
            </div>
        </CustomModal>
        <div class="card flex flex-grow flex-col gap-4">
            <div class="flex justify-center gap-4">
                <SelectMultiCheckbox
                    v-model="filesFilters"
                    :filters="['Study Docs', 'Info Docs']"
                />
                <input
                    class="rounded-full bg-2 py-2 px-4 flex-grow"
                    type="text"
                    placeholder="Rechercher un fichier"
                >
                <div class="flex ">
                    <div
                        class="bg-2 rounded-l-full flex items-center justify-center pr-3 pl-4 transition"
                        :class="{'text-blue-500':docStyleList}"
                        @click="docStyleList = true"
                    >
                        <i class="ri-list-check" />
                    </div>

                    <div
                        class="bg-2 rounded-r-full flex items-center justify-center pr-4 pl-3 transition"
                        :class="{'text-blue-500':!docStyleList}"
                        @click="docStyleList = false"
                    >
                        <i class="ri-function-line" />
                    </div>
                </div>
            </div>
            <div v-if="$store.state.files.studyDocs">
                <table
                    v-if="docStyleList"
                    class="w-full table-auto text-center"
                >
                    <thead>
                        <tr>
                            <th />
                            <th />
                            <th>
                                Nom
                            </th>
                            <th>
                                Type
                            </th>
                            <th>
                                Date
                            </th>
                            <th>
                                Taille
                            </th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(file, i) in $store.state.files.studyDocs"
                            :key="i"
                            class="group rounded-full"
                            :class="[file == filePreview ? 'bg-2':'']"
                        >
                            <td>
                                <div class="flex items-center justify-center">
                                    <input
                                        :class="[fileGroup.length == 0 ? 'invisible group-hover:visible':'']"
                                        type="checkbox"
                                        :checked="fileGroup.includes(file)"
                                        @click="updateFileGroup(file)"
                                    >
                                </div>
                            </td>
                            <td class="p-2">
                                <div
                                    class="flex justify-center items-center"
                                    @click="setFilePreview(file)"
                                >
                                    <DocImg
                                        class="h-8 w-8"
                                        :mime="file.file.mimeType"
                                        :file-name="file.file.originalName"
                                    />
                                </div>
                            </td>
                            <td class="p-2">
                                <div
                                    class="flex justify-center items-center"
                                    @click="setFilePreview(file)"
                                >
                                    {{ file.file.originalName }}
                                </div>
                            </td>
                            <td>
                                <div
                                    class="flex justify-center items-center"
                                    @click="setFilePreview(file)"
                                >
                                    {{ file.file.fileKind }}
                                </div>
                            </td>
                            <td class="p-2">
                                <div
                                    class="flex justify-center items-center"
                                    @click="setFilePreview(file)"
                                >
                                    {{ new Date(file.createdAt).toLocaleDateString() }}
                                </div>
                            </td>
                            <td class="p-2">
                                <div
                                    class="flex justify-center items-center"
                                    @click="setFilePreview(file)"
                                >
                                    {{ formatBytes(file.file.fileSize) }}
                                </div>
                            </td>
                            <td>
                                <div
                                    class="flex justify-center items-center hover:cursor-pointer invisible group-hover:visible"
                                >
                                    <DropDownInput
                                        :buttons="dropDownButtons(file)"
                                    >
                                        <i class="ri-more-line" />
                                    </DropDownInput>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div
                    v-else
                    class="relative"
                >
                    <div class="pb font-bold">
                        Study Docs
                    </div>
                    <hr class="py-2">

                    <div

                        class="grid grid-cols-6 auto-rows-min gap-4"
                    >
                        <div
                            v-for="(file, i) in $store.state.files.studyDocs"
                            :key="i"
                            class="flex flex-col justify-center items-center gap-1 rounded hover:bg-2 relative group"
                        >
                            <input
                                type="checkbox"
                                class="absolute top-0 left-0"
                                :class="[fileGroup.length == 0 ? 'invisible group-hover:visible':'']"
                                :checked="fileGroup.includes(file)"
                                @click="updateFileGroup(file)"
                            >
                            <VPopper
                                :offset-distance="'0'"
                                :interactive="false"
                            >
                                <div class="flex flex-col items-center justify-center">
                                    <DocImg
                                        class="h-12 w-12"

                                        :mime="file.file.mimeType"
                                        :file-name="file.file.originalName"
                                    />
                                    <div class="truncate w-full text-center">
                                        {{ file.file.originalName }}
                                    </div>
                                </div>

                                <template
                                    #content
                                >
                                    <div class="card p-2 flex flex-col">
                                        <div
                                            v-for="(button, index) in dropDownButtons(file.studyDocId)"
                                            :key="index"
                                            class="py-2 px-4 rounded-xl flex justify-center items-center gap-2"
                                            :class="button.class"
                                            @click="button.action()"
                                        >
                                            <i :class="button.icon" />
                                            {{ button.name }}
                                        </div>
                                    </div>
                                </template>
                            </VPopper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="filePreview || fileGroup.length != 0"
            class="w-1/4 hidden md:block relative"
        >
            <div class="sticky top-4">
                <div class="flex flex-col gap-2">
                    <div
                        v-if="filePreview"
                        class="card"
                    >
                        <div class="flex flex-col gap-2 divide-y">
                            <div class="flex items-center justify-center">
                                <img
                                    class="h-32 w-32"
                                    :src="fileIcon"
                                    alt=""
                                >
                            </div>
                            <div class="text-center">
                                <div class="text-xl font-bold">
                                    {{ filePreview.file.originalName }}
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
                    <div
                        v-if="fileGroup.length != 0"
                        class="card"
                    >
                        <div class="flex flex-col gap-2">
                            <div class="font-bold">
                                {{ fileGroup.length }} fichier{{ fileGroup.length>1?'s':'' }}
                            </div>
                            <div
                                v-for="(file, i) in fileGroup"
                                :key="i"
                                class="flex justify-between"
                            >
                                <div>
                                    {{ file.file.originalName }}
                                </div>
                                <div
                                    class="cursor-pointer"
                                    @click.prevent="updateFileGroup(file)"
                                >
                                    <i class="ri-close-line text-red-500" />
                                </div>
                            </div>
                            <div class="flex gap-2 mt-2 w-full items-center justify-center">
                                <div
                                    class="button text-center "
                                    @click="downloadFileGroup"
                                >
                                    <div>Telecharger</div>
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

import formatBytes from '@/utils/formatByteSize'

import fileIcon from "@/assets/img/doctype/file.png"

import SelectMultiCheckbox from '@/components/Input/SelectMultiCheckbox.vue'
import DropDownInput from '@/components/Input/DropDownInput.vue'
import DocImg from '../../components/DocImg.vue'
import CustomModal from '@/components/CustomModal.vue'

import filesService from '@/services/files.service'

export default {
    components:{

        SelectMultiCheckbox,
        DropDownInput,
        CustomModal,
        DocImg

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
            Date
        }
    },
    mounted() {
        this.$store.dispatch("files/getStudyDocs")
    },
    methods: {
        dropDownButtons(studyDocId){
            return [
                {name:'Télécharger', icon:'ri-download-line', class:"hover:bg-blue-500 hover:text-white", action: ()=>{filesService.downloadFile({query: studyDocId.file.fileUploadId, label:studyDocId.file.originalName})}},
                {name:'Supprimer', icon:'ri-close-line', class:"hover:bg-red-500 hover:text-white", action: ()=>{console.log("Delete",studyDocId)}}
            ]
        },
        seeDropdown(e, studyDocId){
            this.showDropDownFileCard = true
            this.$refs.dropDownButtonCard
            console.log(e, studyDocId)
        },
        setFilePreview(file){
            this.filePreview = file
        },
        updateFileGroup(file){
            if(this.fileGroup.includes(file)){
                this.fileGroup = this.fileGroup.filter(f => f != file)
            }else{
                this.fileGroup.push(file)
            }
        },
        downloadFileGroup(){
            for(const el of this.fileGroup){
                filesService.downloadFile({query: el.file.fileUploadId, label:el.file.originalName})
            }
            this.fileGroup = []
        }
    },
}
</script>
