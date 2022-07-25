<template>
    <div>
        <div
            class="input relative h-full w-full p-2"
            @drop.prevent="addFileByDrop"
            @dragover.prevent="dragover = true"
            @dragleave.prevent="dragover = false"
        >
            <div class="h-full w-full">
                <div
                    v-if="modelValue.length == 0"
                    :class="{ 'outline-2': dragover }"
                    class="flex h-full cursor-pointer flex-col items-center justify-center rounded outline-blue-500 hover:outline-dashed hover:outline-2 dark:outline-blue-700"
                    tabindex="0"
                    @keydown.enter="$refs.inputFile.click()"
                    @click="$refs.inputFile.click()"
                >
                    <i
                        class="fas text-xl"
                        :class="dragover ? 'fa-cloud-download-alt' : 'fa-cloud-upload-alt'"
                    />
                    <div v-if="!message.length" class="text-center">
                        <span class="text-blue-500 hover:underline"> Cliquez </span> ou glissez vos
                        {{ fileLimit != -1 ? fileLimit : '' }} fichiers ici !
                    </div>
                    <div v-else class="text-center" v-html="message"></div>
                </div>
                <div
                    v-else
                    class="grid h-full w-full auto-rows-[100%] gap-2 overflow-y-scroll"
                    :class="[fileLimit != 1 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1']"
                >
                    <div
                        v-for="(file, index) in modelValue"
                        :key="index"
                        class="text-1 bg-1 w-full rounded shadow-md"
                    >
                        <div
                            class="border-color-0 flex h-19/24 w-full flex-col items-center justify-center gap-2 border-b p-2"
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
                        <div class="flex h-5/24 w-full items-center justify-between p-2">
                            {{ formatBytes(file.size, 0) }}
                            <div class="flex gap-2">
                                <button
                                    v-if="canDownload"
                                    title="Télécharger le fichier"
                                    @click.prevent="downloadFile(file)"
                                >
                                    <i class="fa-solid fa-download text-blue-500"></i>
                                </button>
                                <button
                                    v-if="canDelete === true"
                                    title="Enlever le fichier"
                                    @click.prevent="removeFile(file)"
                                >
                                    <i class="fas fa-times text-red-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="modelValue.length != fileLimit"
                        class="text-2 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 p-4 text-center text-gray-500 dark:border-gray-500"
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
            message: {
                type: String,
                default: '',
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
