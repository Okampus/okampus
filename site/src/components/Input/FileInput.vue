<template>
    <div>
        <div class="w-full h-full flex flex-col gap-4">
            <div
                class="input w-full h-18/24"
                @drop.prevent="addFileByDrop"
                @dragover.prevent="dragover = true"
                @dragleave.prevent="dragover = false"
            >
                <div
                    class="w-full h-full"
                    :class="{'rounded border-4 border-dashed border-blue-500 dark:border-blue-700': dragover}"
                >
                    <div
                        v-if="modelValue.length == 0"

                        class="flex flex-col h-full items-center justify-center"
                    >
                        <i
                            class="ri-4x"
                            :class="[dragover ? 'ri-download-cloud-2-line':'ri-upload-cloud-2-line']"
                        />
                        Glissez vos fichiers ici
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
                                <img
                                    v-else
                                    :class="[imgPreview ? 'h-20/24':'h-1/2']"
                                    :src="imgDocType(file.name, file.type)"
                                    alt=""
                                >
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
                    </div>
                </div>
            </div>

            <div
                class="h-4/24 flex gap-2"
            >
                <button
                    class="flex-grow h-full text-center button"
                    :disabled="fileLimit != 0 && fileLimit == modelValue.length"
                >
                    <div
                        class="h-full w-full flex justify-center items-center"
                    >
                        <label
                            class="flex-grow"
                            for="file"
                        >
                            <p>
                                + Ajoutez des fichiers <span v-if="fileLimit > 1"> {{ modelValue.length }} / {{ fileLimit }} </span>
                            </p>
                        </label>
                        <input
                            id="file"
                            ref="inputFile"
                            :disabled="fileLimit != 0 && fileLimit == modelValue.length"
                            class="opacity-0 absolute -z-50"
                            type="file"
                            :multiple="fileLimit != 1"
                            @change="addFileByInput"
                        >
                    </div>
                </button>
                <button
                    class=" h-full button"

                    @click.prevent="$emit('update:modelValue', [])"
                >
                    <div class="h-full flex justify-center items-center">
                        <i class="ri-close-line" />
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>

import avi from "@/assets/img/doctype/avi.png"
//import csv from "@/assets/img/doctype/csv.png"
import doc from "@/assets/img/doctype/doc.png"
import jpg from "@/assets/img/doctype/jpg.png"
import mp4 from "@/assets/img/doctype/mp4.png"
import pdf from "@/assets/img/doctype/pdf.png"
import png from "@/assets/img/doctype/png.png"
import ppt from "@/assets/img/doctype/ppt.png"
import rar from "@/assets/img/doctype/rar.png"
import sms from "@/assets/img/doctype/sms.png"
import svg from "@/assets/img/doctype/svg.png"
//import xls from "@/assets/img/doctype/xls.png"
import zip from "@/assets/img/doctype/zip.png"

import file from "@/assets/img/doctype/file.png"


import formatBytes from "@/utils/formatByteSize.js"

export default {
    props:{
        modelValue: {
            type:Array,
            required:true
        },
        mimes: {
            type:Array,
            default: () => []
        },
        imgPreview: {
            type: Boolean,
            default: false
        },
        fileLimit: {
            type: Number,
            default: 0
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
    methods: {
        imgDocType(name){
            const imgName = {
                ".png": (png, 'png'),
                ".jpg": (jpg, 'jpg'),
                ".jpeg": (jpg, 'jpg'),
                ".svg": (svg, 'svg'),
                ".avi": (avi, 'avi'),
                ".mp4":(mp4, 'mp4'),
                ".txt":(sms, "txt"),
                ".rar":(rar, 'rar'),
                ".zip":(zip, 'zip'),
                ".ppt":(ppt, 'ppt'),
                ".docx":(doc, 'doc'),
                ".odt":(doc, 'doc'),
                ".pdf":(pdf,'pdf')
            }

            for(const el of Object.getOwnPropertyNames(imgName)){
                if(name.endsWith(el)){
                    return imgName[el]
                }
            }
            return file

        },
        formatBytes : formatBytes,
        checkMimes(exp){
            const mimes = [
                RegExp("^image/(.)+"),
                RegExp("^audio/(.)+"),
                RegExp("^text/(.)+"),
                RegExp("^video/(.)+"),
                RegExp(String.raw`^application/vnd\.oasis\.opendocument\.presentation`),
                RegExp(String.raw`^application/vnd\.oasis\.opendocument\.spreadsheet`),
                RegExp(String.raw`^application/vnd\.oasis\.opendocument\.text`),
                RegExp(String.raw`^application/vnd\.ms-powerpoint`),
                RegExp(String.raw`^application/vnd\.openxmlformats-officedocument\.presentationml\.presentation`),
                RegExp(String.raw`^application/vnd\.ms-excel`),
                RegExp(String.raw`^application/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet`),
                RegExp(String.raw`^application/vnd\.openxmlformats-officedocument\.wordprocessingml\.document`),
                RegExp("^application/msword"),
                RegExp("^application/xml"),
                RegExp("^application/json"),
                RegExp("^application/pdf")
            ]

            for(const el of mimes){
                if(el.test(exp)){
                    return true
                }
            }
            return false

        },
        addFileByInput(){
            let files = []
            for(const el of this.$refs.inputFile.files){
                if(this.fileLimit <= this.modelValue.length && this.fileLimit != 0){
                    this.$emit("update:modelValue", this.modelValue.filter((f, index) => {
                        if(index != 0){
                            return f;
                        }
                    }))
                }
                if(this.checkMimes(el.type)){
                    files.push(el)
                }
            }
            this.$emit("update:modelValue", this.modelValue.concat(files))
        },
        addFileByDrop(e) {

            this.dragover = false
            let droppedFiles = e.dataTransfer.files;
            let files = []
            if(!droppedFiles) return;
            ([...droppedFiles]).forEach(f => {
                if(this.fileLimit <= this.modelValue.length && this.fileLimit != 0){
                    this.$emit("update:modelValue", this.modelValue.filter((f, index) => {
                        if(index != 0){
                            return f;
                        }
                    }))
                }
                if(this.checkMimes(f.type)){
                    files.push(f)
                }
            })
            this.$emit("update:modelValue", this.modelValue.concat(files))
        },
        removeFile(file){
            /* this.files = this.files.filter(f => {
                return f != file;
            }); */
            this.$emit("update:modelValue", this.modelValue.filter(f => {
                return f != file;
            }))
        },
    }
}
</script>
