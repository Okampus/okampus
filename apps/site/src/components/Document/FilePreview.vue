<template>
    <div class="flex justify-around p-2 w-full rounded shadow-md text-1 bg-1">
        <div class="flex gap-2 items-center w-3/4">
            <DocumentIcon :file-name="file.name" :mime="file.mimeType" class="w-16 h-16" />
            <div class="truncate">
                {{ file.name }}
            </div>
        </div>
        <div class="flex gap-2 justify-center items-center">
            <button
                v-if="canDelete"
                title="Enlever le fichier"
                @click.prevent="$emit('delete', file.fileUploadId)"
            >
                <i class="text-red-500 fas fa-times" />
            </button>
            <button v-if="canDownload" title="Télécharger le fichier" @click.prevent="downloadFile(file)">
                <i class="text-blue-500 fa-solid fa-cloud-arrow-down"></i>
            </button>
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
