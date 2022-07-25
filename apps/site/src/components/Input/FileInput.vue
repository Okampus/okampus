<template>
    <div>
        <div
            class="input relative h-full w-full p-2"
            @drop.prevent="addFileByDrop"
            @dragover.prevent="dragover = true"
            @dragleave.prevent="dragover = false"
        >
            <div
                v-if="modelValue.length == 0"
                :class="{ 'outline-2': dragover }"
                class="flex h-full cursor-pointer flex-col items-center justify-center rounded outline-blue-500 hover:outline-dashed hover:outline-2 dark:outline-blue-700"
                tabindex="0"
                @keydown.enter="$refs.inputFile.click()"
                @click="$refs.inputFile.click()"
            >
                <i class="fas text-xl" :class="dragover ? 'fa-cloud-download-alt' : 'fa-cloud-upload-alt'" />
                <div v-if="!message.length" class="text-center">
                    <span class="text-blue-500 hover:underline"> Cliquez </span> ou glissez vos
                    {{ fileLimit != -1 ? fileLimit : '' }} fichiers ici !
                </div>
                <div v-else class="text-center">{{ message }}</div>
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
                        <img v-if="imgPreview && isImage(file)" class="h-18/24" :src="getImageSrc(file)" />
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

<script setup>
    import DocumentIcon from '@/components/Document/DocumentIcon.vue'
    import formatBytes from '@/utils/formatByteSize.js'
    import { computed, ref } from 'vue'

    const props = defineProps({
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
        allowedMimes: {
            type: Array,
            default: () => ['.*'],
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
    })

    const emit = defineEmits(['update:modelValue'])

    const inputFile = ref(null)

    const getImageSrc = (img) => URL.createObjectURL(img)
    const isImage = (file) => RegExp('^image/(.)+').test(file.type)

    const totalFileSize = computed(() => props.modelValue.reduce((acc, file) => acc + file.size, 0))

    const dragover = ref(false)

    const isAllowedMime = (fileMime) => {
        for (const mime of props.allowedMimes) {
            if (RegExp(mime).test(fileMime)) {
                return true
            }
        }
    }

    const addFile = (file) => {
        if (isAllowedMime(file.type) && totalFileSize.value + file.size <= props.sizeLimit) {
            emit('update:modelValue', [file, ...props.modelValue].slice(0, props.fileLimit))
        }
    }

    const addFileByInput = () => Array.from(inputFile.value.files).forEach(addFile)
    const addFileByDrop = (e) => {
        e.preventDefault()
        dragover.value = false
        Array.from(e.dataTransfer.files).forEach(addFile)
    }

    const downloadFile = (file) => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(file)
        a.download = file.name
        a.click()
    }
    const removeFile = (file) => {
        emit(
            'update:modelValue',
            props.modelValue.filter((f) => f !== file),
        )
    }
</script>
