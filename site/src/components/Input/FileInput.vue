<template>
    <div>
        <div
            class="input w-full h-full relative p-2 "
            @drop.prevent="addFileByDrop"
            @dragover.prevent="dragover = true"
            @dragleave.prevent="dragover = false"
        >
            <div
                class="w-full h-full "
            >
                <div
                    v-if="modelValue.length == 0"
                    :class="{'outline-2': dragover}"
                    class="cursor-pointer flex flex-col h-full items-center justify-center rounded hover:outline-dashed outline-blue-500 dark:outline-blue-700 hover:outline-2"
                    @click="$refs.inputFile.click()"
                >
                    <i
                        class="ri-4x"
                        :class="[dragover ? 'ri-download-cloud-2-line':'ri-upload-cloud-2-line']"
                    />
                    <div><span class="text-blue-500 hover:underline">Cliquez</span> ou glissez vos {{ fileLimit !=-1 ? fileLimit:'' }} fichiers ici </div>
                </div>
                <div
                    v-else
                    class="h-full grid gap-2 overflow-y-scroll auto-rows-[100%]"
                    :class="[fileLimit != 1 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : '']"
                >
                    <div
                        v-for="(file,index) in modelValue"
                        :key="index"
                        class="text-1 bg-1 shadow-md rounded"
                    >
                        <div

                            class="h-19/24 w-full flex flex-col justify-center items-center gap-2 border-color-0 border-b p-2"
                        >
                            <img
                                v-if="imgPreview && RegExp('^image/(.)+').test(file.type)"
                                class="h-18/24"
                                :src="URL.createObjectURL(file)"
                            >
                            <DocImg
                                v-else
                                :file-name="file.name"
                                :mime="file.type"
                            />
                            <div class="w-full">
                                <div class="text-center truncate">
                                    {{ file.name }}
                                </div>
                            </div>
                        </div>
                        <div class="h-5/24 w-full flex items-center justify-between p-2">
                            {{ formatBytes(file.size, 0) }}
                            <button
                                title="Enlever le fichier"
                                @click.prevent="removeFile(file)"
                            >
                                <i class="ri-close-line text-red-500" />
                            </button>
                        </div>
                    </div>
                    <div
                        v-if="modelValue.length != fileLimit"
                        class="cursor-pointer w-full h-full border-dashed border-2 border-gray-300 dark:border-gray-500 text-gray-500 rounded flex flex-col items-center justify-center text-2 p-4 text-center"
                        @click="$refs.inputFile.click()"
                    >
                        Ajouter un fichier
                        <div class="text-xl">
                            +
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-between">
            <div
                :class="[modelValue.length==0 || fileLimit == -1?'invisible':'']"
                class="text-2"
            >
                {{ modelValue.length }}/{{ fileLimit }}
            </div>
            <div
                :class="[totalFileSize <= sizeLimit*0.5?'invisible':'']"
                class="text-2"
            >
                {{ formatBytes(totalFileSize) }}/{{ formatBytes(sizeLimit) }}
            </div>
        </div>

        <input
            ref="inputFile"
            :disabled="fileLimit == modelValue.length"
            class="hidden"
            type="file"
            :multiple="fileLimit != 1"
            @change="addFileByInput"
        >
    </div>
</template>

<script>

import DocImg from '../DocImg.vue'
import formatBytes from "@/utils/formatByteSize.js"

export default {
    components:{
        DocImg
    },
    props:{
        modelValue: {
            type:Array,
            required:true
        },
        imgPreview: {
            type: Boolean,
            default: false
        },
        fileLimit: {
            type: Number,
            default: -1
        },
        regexMimes:{
            type: Array,
            default(){
                return String.raw`*`
            }
        },
        sizeLimit:{
            type:Number,
            required: true
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            URL,
            RegExp,
            dragover: false,
        }
    },
    computed:{
        totalFileSize(){
            return this.modelValue.reduce((sum, file)=>sum+file.size, 0)
        }
    },
    methods: {
        formatBytes : formatBytes,
        checkMimes(exp){
            for(const el of this.regexMimes){
                if(RegExp(el).test(exp)){
                    return true
                }
            }
            return false
        },
        addFileByInput(){
            for(const el of this.$refs.inputFile.files){
                this.addFile(el)
            }
        },
        addFileByDrop(e) {
            this.dragover = false
            let droppedFiles = e.dataTransfer.files;
            if(!droppedFiles) return;
            ([...droppedFiles]).forEach(f => {
                this.addFile(f)
            })
        },
        addFile(file){
            if(this.checkMimes(file.type) && this.checkSize(file.size)){
                const temp = this.modelValue
                if(temp.length == this.fileLimit){
                    temp.shift()
                }
                temp.push(file)
                this.$emit("update:modelValue", temp)
            }
        },
        checkSize(fileSize){
            if(this.totalFileSize + fileSize <= this.sizeLimit){
                return true
            }
            return false
        },
        removeFile(file){
            this.$emit("update:modelValue", this.modelValue.filter(f => {
                return f != file;
            }))
        },
    }
}
</script>
