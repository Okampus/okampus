<template>
    <div class="flex flex-col gap-8 card-2">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div v-for="(doc, i) in documentList" :key="i" class="flex flex-col">
                <div class="text-lg truncate">{{ doc.name }}</div>
                <FileInput
                    v-if="doc.file.length === 0"
                    v-model="doc.model"
                    class="w-full h-36"
                    :file-limit="1"
                    :size-limit="2000000"
                ></FileInput>
                <FilePreview
                    v-else
                    class="w-full h-36"
                    :file="doc.file[0].file"
                    :can-delete="true"
                    @delete="(val) => deleteFile(val)"
                ></FilePreview>
            </div>
        </div>
        <div class="flex flex-col gap-4">
            <div class="text-lg">Galerie photo</div>
            <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
                <img
                    v-for="(img, i) in clubsStore.club.files.filter((doc) => doc.type === 'gallery')"
                    :key="i"
                    :src="img.file.url"
                    class="w-full h-36 aspect-ratio-16/9"
                />
            </div>
            <FileInput
                v-model="galleryInput"
                class="w-full h-32"
                :img-preview="true"
                :size-limit="20000000"
            ></FileInput>
            <div class="flex flex-row-reverse">
                <div class="button-submit" @click="uploadGallery">Envoyer</div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useClubsStore } from '@/store/clubs.store'
    import FileInput from '@/components/Input/FileInput.vue'
    import FilePreview from '@/components/Document/FilePreview.vue'
    import { ref, watch, computed } from 'vue'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const clubsStore = useClubsStore()
    await clubsStore.getClubFiles(props.club.teamId)

    const galleryInput = ref([])

    const documentList = ref([
        {
            name: 'Passation',
            file: computed(() =>
                clubsStore.club.files.filter(
                    (doc) => doc.description === 'handover' && doc.type === 'document',
                ),
            ),
            description: 'handover',
            model: [],
        },
        {
            name: 'Status',
            file: computed(() =>
                clubsStore.club.files.filter(
                    (doc) => doc.description === 'statute' && doc.type === 'document',
                ),
            ),
            description: 'statute',
            model: [],
        },
        {
            name: 'Réglement interieur',
            file: computed(() =>
                clubsStore.club.files.filter(
                    (doc) => doc.description === 'internal' && doc.type === 'document',
                ),
            ),
            description: 'internal',
            model: [],
        },
    ])

    for (let i = 0; i < documentList.value.length; i++) {
        watch(
            () => documentList.value[i].model,
            () => {
                if (documentList.value[i].model.length) {
                    console.log('ok')
                    clubsStore.postClubFile(
                        props.club.teamId,
                        'document',
                        documentList.value[i].model[0],
                        documentList.value[i].description,
                    )
                    documentList.value[i].model = []
                }
            },
            { deep: true },
        )
    }

    const deleteFile = (fileId) => {
        clubsStore.deleteClubFile(
            clubsStore.club.files.find((el) => el.file.fileUploadId === fileId).teamFileId,
        )
    }

    const uploadGallery = () => {
        for (const el of galleryInput.value) {
            clubsStore.postClubFile(props.club.teamId, 'gallery', el)
        }
        galleryInput.value = []
    }
</script>
