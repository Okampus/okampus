<template>
    <div class="text-1 bg-1 flex w-full justify-around rounded p-2 shadow-md">
        <div class="flex w-3/4 items-center gap-2">
            <DocumentIcon :file-name="file.name" :mime="file.mimeType" class="h-16 w-16" />
            <div class="truncate">
                {{ file.name }}
            </div>
        </div>
        <div class="flex items-center justify-center gap-2">
            <button
                v-if="canDelete"
                title="Enlever le fichier"
                @click.prevent="$emit('delete', file.fileUploadId)"
            >
                <i class="fas fa-times text-red-500" />
            </button>
            <button v-if="canDownload" title="Télécharger le fichier" @click.prevent="downloadFile(file)">
                <i class="fa-solid fa-cloud-arrow-down text-blue-500"></i>
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
