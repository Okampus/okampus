<template>
    <div>
        <AvatarCropper
            v-if="canCrop"
            v-model="cropping"
            :file="croppingFile"
            :upload-url="imageParams.url"
            :request-options="{
                method: 'PUT',
                credentials: 'include',
                headers: { 'X-Tenant-Id': getTenant() },
            }"
            :labels="{ submit: 'Valider', cancel: 'Annuler' }"
            :cropper-options="
                imageParams?.ratio
                    ? { aspectRatio: 1 / imageParams.ratio, zoomable: true, movable: true }
                    : { scalable: true, zoomable: true, movable: true }
            "
            @error="
                (error) =>
                    imageParams?.onUploadFailure?.(error) ?? showErrorToast('Avec de l\'upload de l\'image !')
            "
            @completed="
                (avatar) =>
                    imageParams?.onUploadSuccess?.(avatar) ??
                    showSuccessToast('Image uploadée avec succès 🎉')
            "
        />
        <div
            class="input relative min-h-[12rem] w-full p-0 focus:outline-none"
            :class="[hover ? 'bg-1-light !ring-2 ring-blue-500 dark:bg-1-dark' : '']"
            :style="imageParams.ratio ? { 'padding-top': `calc(${100 * imageParams.ratio}% + 4rem)` } : {}"
            tabindex="0"
            @mouseenter="hover = true"
            @mouseleave="hover = false"
            @focus="hover = true"
            @blur="hover = false"
            @dragover.prevent="hover = true"
            @dragleave.prevent="hover = false"
            @drop.prevent="addFileByDrop"
            @keydown.enter="input.click()"
        >
            <div
                class="text-2 absolute inset-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
                @click="input.click()"
            >
                <template v-if="modelValue !== null">
                    <img
                        v-if="modelValue.fileType === IMAGE"
                        class="m-4 rounded-md"
                        :src="modelValue.url ? modelValue.url : getObjectUrl(modelValue)"
                        :style="imageParams?.ratio ? { 'aspect-ratio': `1 / ${imageParams.ratio}` } : {}"
                    />
                    <DocumentIcon v-else class="m-4 h-[calc(100%-4rem)]" :file="{ fileType: type }" />
                    <div class="bg-3 flex h-[3rem] w-full items-center gap-2 rounded-b-md p-2">
                        <!-- TODO: add meta information regarding who uploaded, at what time, etc. -->
                        <div class="text-xs">
                            {{ bytes(modelValue.url ? modelValue.fileSize : modelValue.size) }}
                        </div>
                        <span v-tooltip="modelValue.name" class="line-clamp-1">{{ modelValue.name }}</span>
                        <button
                            v-tooltip="'Télécharger'"
                            @click.stop="downloadFile(modelValue, !modelValue.url)"
                        >
                            <i
                                class="fa-solid fa-download flex h-6 w-6 items-center justify-center rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600"
                            />
                        </button>
                        <button
                            v-tooltip="'Supprimer'"
                            @click.stop="
                                () => {
                                    removeCallback(modelValue, file)
                                    removeFile()
                                }
                            "
                        >
                            <i
                                class="fas fa-trash flex h-6 w-6 items-center justify-center rounded-md bg-red-500 text-sm text-white hover:bg-red-600"
                            />
                        </button>
                    </div>
                </template>
                <template v-else>
                    <i :class="hover ? 'fa fa-cloud-upload-alt' : type.icon" class="mb-3 text-5xl" />
                    <div class="text-0 text-center text-lg">
                        Faites glissez ou
                        <span class="card-link text-blue-500 hover:underline">parcourez</span> vos fichiers
                    </div>
                    <div class="text-1 mt-1.5 text-center">
                        <span class="text-sm">{{ type.allowedString }}</span>
                        <span class="text-3 ml-1 text-xs">{{
                            sizeLimit ? `Max. ${bytes(sizeLimit)}` : ''
                        }}</span>
                    </div>
                    <div v-if="imageParams.ratio && imageParams.minWidth" class="text-1 mt-1 text-sm">
                        Dimensions recommandées :
                        <span class="font-semibold">
                            {{ imageParams.minWidth }}x{{ imageParams.minWidth * imageParams.ratio }}
                        </span>
                    </div>
                </template>
            </div>
        </div>

        <input ref="input" class="hidden" type="file" @change="addFileByInput" />
    </div>
</template>

<script setup>
    import AvatarCropper from 'vue-avatar-cropper'
    import DocumentIcon from '@/components/Document/DocumentIcon.vue'

    import { computed, ref } from 'vue'

    import { showSuccessToast, showErrorToast } from '@/utils/toast'

    import { ANY, IMAGE, FILE_TYPES, testCondition } from '@/shared/assets/file-types'
    import { downloadFile, getObjectUrl } from '@/utils/downloadFile'

    import { getTenant } from '@/utils/getTenant'

    import bytes from 'bytes'

    const props = defineProps({
        modelValue: {
            type: Object,
            default: null,
        },
        file: {
            type: Object,
            default: null,
        },
        fileType: {
            type: String,
            default: ANY,
        },
        imageParams: {
            type: Object,
            default: () => ({}),
        },
        removeCallback: {
            type: Function,
            default: () => {},
        },
        sizeLimit: {
            type: Number,
            default: 1048576,
        },
        message: {
            type: String,
            default: '',
        },
    })

    const type = computed(() => (props.fileType in FILE_TYPES ? FILE_TYPES[props.fileType] : FILE_TYPES[ANY]))
    const canCrop = computed(() => props.fileType === IMAGE && props.imageParams.url)

    const emit = defineEmits(['update:modelValue'])
    const input = ref(null)

    const cropping = ref(false)
    const croppingFile = ref(null)

    const isAllowedType = (file) => testCondition(type.value.condition, file)

    const addFile = (file) => {
        const errorTitle = { title: `Échec de l'upload de "${file.name}"` }
        if (!isAllowedType(file)) {
            showErrorToast("Le fichier n'est pas d'un type autorisé.", errorTitle)
            return
        }
        if (props.sizeLimit && file.size > props.sizeLimit) {
            showErrorToast(
                `Le fichier ${file.name} est trop volumineux (limite: ${bytes(props.sizeLimit)}).`,
                errorTitle,
            )
            return
        }

        file.fileType = type
        emit('update:modelValue', file)
    }

    const addFileByInput = () => {
        if (input.value.files.length) {
            if (canCrop.value) {
                croppingFile.value = input.value.files[input.value.files.length - 1]
                cropping.value = true
            } else {
                addFile(input.value.files[input.value.files.length - 1])
            }
        }
    }

    const hover = ref(false)
    const addFileByDrop = (e) => {
        e.preventDefault()
        if (e.dataTransfer.files.length) {
            if (canCrop.value) {
                croppingFile.value = e.dataTransfer.files[e.dataTransfer.files.length - 1]
                cropping.value = true
            } else {
                addFile(e.dataTransfer.files[e.dataTransfer.files.length - 1])
            }
        }
    }

    const removeFile = () => emit('update:modelValue', null)
</script>
