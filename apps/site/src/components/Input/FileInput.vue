<template>
    <div>
        <div
            class="relative p-2 w-full h-full input"
            @drop.prevent="addFileByDrop"
            @dragover.prevent="dragover = true"
            @dragleave.prevent="dragover = false"
        >
            <div class="w-full h-full">
                <div
                    v-if="modelValue.length == 0"
                    :class="{ 'outline-2': dragover }"
                    class="flex flex-col justify-center items-center h-full rounded hover:outline-2 outline-blue-500 dark:outline-blue-700 hover:outline-dashed cursor-pointer"
                    tabindex="0"
                    @keydown.enter="$refs.inputFile.click()"
                    @click="$refs.inputFile.click()"
                >
                    <i
                        class="text-xl fas"
                        :class="dragover ? 'fa-cloud-download-alt' : 'fa-cloud-upload-alt'"
                    />
                    <div class="text-center">
                        <span class="text-blue-500 hover:underline"> Cliquez </span> ou glissez vos
                        {{ fileLimit != -1 ? fileLimit : '' }} fichiers ici !
                    </div>
                </div>
                <div
                    v-else
                    class="grid overflow-y-scroll auto-rows-[100%] gap-2 w-full h-full"
                    :class="[fileLimit != 1 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1']"
                >
                    <div
                        v-for="(file, index) in modelValue"
                        :key="index"
                        class="w-full rounded shadow-md text-1 bg-1"
                    >
                        <div
                            class="flex flex-col gap-2 justify-center items-center p-2 w-full h-19/24 border-b border-color-0"
                        >
                            <img
                                v-if="imgPreview && RegExp('^image/(.)+').test(file.type)"
                                class="h-18/24"
                                :src="URL.createObjectURL(file)"
                            />
                            <DocumentIcon v-else :file-name="file.name" :mime="file.type" />
                            <div class="w-full text-center">
                                <div class="truncate">
                                    {{ file.name }}
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between items-center p-2 w-full h-5/24">
                            {{ formatBytes(file.size, 0) }}
                            <div class="flex gap-2">
                                <button
                                    v-if="canDownload"
                                    title="Télécharger le fichier"
                                    @click.prevent="downloadFile(file)"
                                >
                                    <i class="text-blue-500 fa-solid fa-download"></i>
                                </button>
                                <button
                                    v-if="canDelete === true"
                                    title="Enlever le fichier"
                                    @click.prevent="removeFile(file)"
                                >
                                    <i class="text-red-500 fas fa-times" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="modelValue.length != fileLimit"
                        class="flex flex-col justify-center items-center p-4 w-full h-full text-center text-gray-500 rounded border-2 border-gray-300 dark:border-gray-500 border-dashed cursor-pointer text-2"
                        tabindex="0"
                        @click="$refs.inputFile.click()"
                        @keydown.enter="$refs.inputFile.click()"
                    >
                        Ajouter un fichier
                        <div class="text-xl">+</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-between">
            <div :class="[modelValue.length == 0 || fileLimit <= 1 ? 'invisible' : '']" class="text-2">
                {{ modelValue.length }}/{{ fileLimit }}
            </div>
            <div :class="[totalFileSize <= sizeLimit * 0.5 ? 'invisible' : '']" class="text-2">
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
        />
    </div>
</template>

<script>
    import DocumentIcon from '@/components/Document/DocumentIcon.vue'
    import formatBytes from '@/utils/formatByteSize.js'

    export default {
        components: { DocumentIcon },
        props: {
            modelValue: {
                type: Array,
                required: true,
            },
            imgPreview: {
                type: Boolean,
                default: false,
            },
            fileLimit: {
                type: Number,
                default: -1,
            },
            regexMimes: {
                type: Array,
                default() {
                    return ['.*']
                },
            },
            sizeLimit: {
                type: Number,
                required: true,
            },
            canDelete: {
                type: Boolean,
                default: true,
            },
            canDownload: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['update:modelValue'],
        data() {
            return {
                URL,
                RegExp,
                dragover: false,
            }
        },
        computed: {
            totalFileSize() {
                return this.modelValue.reduce((sum, file) => sum + file.size, 0)
            },
        },
        methods: {
            formatBytes: formatBytes,
            checkMimes(exp) {
                for (const el of this.regexMimes) {
                    if (RegExp(el).test(exp)) {
                        return true
                    }
                }
                return false
            },
            addFileByInput() {
                for (const el of this.$refs.inputFile.files) {
                    this.addFile(el)
                }
            },
            addFileByDrop(e) {
                this.dragover = false
                let droppedFiles = e.dataTransfer.files
                if (!droppedFiles) return
                ;[...droppedFiles].forEach((f) => {
                    this.addFile(f)
                })
            },
            addFile(file) {
                if (this.checkMimes(file.type) && this.checkSize(file.size)) {
                    const temp = this.modelValue
                    if (temp.length == this.fileLimit) {
                        temp.shift()
                    }
                    temp.push(file)
                    this.$emit('update:modelValue', temp)
                }
            },
            checkSize(fileSize) {
                if (this.totalFileSize + fileSize <= this.sizeLimit) {
                    return true
                }
                return false
            },
            removeFile(file) {
                this.$emit(
                    'update:modelValue',
                    this.modelValue.filter((f) => f != file),
                )
            },
            downloadFile(file) {
                console.log(file)
                const url = URL.createObjectURL(file)
                const a = document.createElement('a')
                a.href = url
                a.download = file.name
                a.click()
            },
        },
    }
</script>
