<template>
    <div>
        <div class="relative w-full h-full">
            <div class="grid overflow-y-scroll grid-cols-1 auto-rows-[100%] gap-2 w-full h-full">
                <div class="w-full rounded shadow-md text-1 bg-1">
                    <div
                        class="flex flex-col gap-2 justify-center items-center p-2 w-full h-19/24 border-b border-color-0"
                    >
                        <img
                            v-if="imgPreview && RegExp('^image/(.)+').test(file.type)"
                            class="h-18/24"
                            :src="file.url"
                        />
                        <DocumentIcon v-else :file-name="file.name" :mime="file.mimeType" />
                        <div class="w-full text-center">
                            <div class="truncate">
                                {{ file.name }}
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 justify-between items-center p-2 w-full h-5/24">
                        <button
                            v-if="canDelete"
                            title="Enlever le fichier"
                            @click.prevent="$emit('delete', file.fileUploadId)"
                        >
                            <i class="text-red-500 fas fa-times" />
                        </button>
                        <button
                            v-if="canDownload"
                            title="Télécharger le fichier"
                            @click.prevent="downloadFile(file)"
                        >
                            <i class="text-blue-500 fa-solid fa-cloud-arrow-down"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import DocumentIcon from '@/components/Document/DocumentIcon.vue'

    const props = defineProps({
        file: {
            type: Object,
            required: true,
        },
        imgPreview: {
            type: Boolean,
            default: false,
        },
        canDelete: { type: Boolean, default: false },
        canDownload: { type: Boolean, default: true },
    })

    defineEmits(['delete'])

    const downloadFile = () => {
        const link = document.createElement('a')
        link.href = props.file.url
        link.download = props.file.name
        link.click()
    }
</script>
