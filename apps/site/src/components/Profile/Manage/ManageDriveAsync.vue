<template>
    <div class="flex flex-col gap-8 card-2">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div v-for="(doc, i) in documentList" :key="i" class="flex flex-col gap-2 w-full">
                <div class="text-lg truncate">{{ doc.name }}</div>
                <FileInput
                    v-if="!doc.file.length"
                    v-model="doc.model"
                    :message="doc.message"
                    class="w-full h-36"
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
        <div class="flex gap-2 justify-center items-center text-red-500">
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
    await clubsStore.getClubFiles(props.club.teamId, 'document')

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
                console.log(model)
                if (model.length > 0) {
                    await clubsStore.postClubFile(props.club.teamId, 'document', model[0], doc.description)
                    doc.model = []
                }
            },
            { deep: true },
        )
    }

    watch(
        () => props.club.teamId,
        async () => {
            await clubsStore.getClubFiles(props.club.teamId, 'document')
        },
    )
</script>
