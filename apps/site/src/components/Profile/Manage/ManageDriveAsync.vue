<template>
    <div class="card-2 flex flex-col gap-8">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div v-for="(doc, i) in documentList" :key="i" class="flex w-full flex-col gap-2">
                <div class="truncate text-lg">{{ doc.name }}</div>
                <FileInput
                    v-if="!doc.file.length"
                    v-model="doc.model"
                    :message="doc.message"
                    class="h-36 w-full"
                    :file-limit="1"
                    :size-limit="2000000"
                />
                <FilePreview
                    v-else
                    class=""
                    :file="doc.file[0].file"
                    :can-delete="true"
                    @delete="(fileId) => clubsStore.deleteClubFileByFileId(fileId)"
                />
            </div>
        </div>
        <div class="flex items-center justify-center gap-2 text-red-500">
            <i class="fa-solid fa-xl fa-triangle-exclamation"></i>
            <div>
                Mettre à jour vos documents légaux est obligatoire pour pouvoir prétendre à des subventions
            </div>
        </div>
    </div>
</template>

<script setup>
    import FileInput from '@/components/Input/FileInput.vue'
    import FilePreview from '@/components/Document/FilePreview.vue'
    import { ref, watch } from 'vue'
    import { useClubsStore } from '@/store/clubs.store'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const clubsStore = useClubsStore()
    await clubsStore.getClubFiles(props.club.id, 'document')

    const documentList = ref([
        {
            name: 'Passation',
            message:
                "<span class='text-blue-500 hover:underline'> Cliquez </span> ou glissez votre nouveau fichier de passation ici !",
            file: clubsStore.club.files.filter((doc) => doc.description === 'handover'),
            description: 'handover',
            model: [],
        },
        {
            name: 'Status',
            message:
                "<span class='text-blue-500 hover:underline'> Cliquez </span> ou glissez vos nouveaux status ici !",
            file: clubsStore.club.files.filter((doc) => doc.description === 'statute'),
            description: 'statute',
            model: [],
        },
        {
            name: 'Réglement intérieur',
            message:
                "<span class='text-blue-500 hover:underline'> Cliquez </span> ou glissez votre nouveau réglement intérieur ici !",
            file: clubsStore.club.files.filter((doc) => doc.description === 'internal'),
            description: 'internal',
            model: [],
        },
    ])

    for (const doc of documentList.value) {
        watch(
            () => doc.model,
            async (model) => {
                if (model.length > 0) {
                    await clubsStore.postClubFile(props.club.id, 'document', model[0], doc.description)
                    doc.model = []
                }
            },
            { deep: true },
        )
    }

    watch(
        () => props.club.id,
        async () => {
            await clubsStore.getClubFiles(props.club.id, 'document')
        },
    )
</script>
