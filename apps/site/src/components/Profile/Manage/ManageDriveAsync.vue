<template>
    <GraphQLQuery
        :query="getTeamFiles"
        :variables="{ id: club.id }"
        :update="(data) => filesByType(data?.clubById?.teamFiles)"
    >
        <template #default="{ data: allFiles }">
            <div v-if="isEmpty(allFiles)">
                <div class="text-0 my-12 flex flex-col items-center justify-center text-2xl">
                    <img :src="Zoom" class="h-40 w-40" />
                    <span class="font-semibold"> Aucune donnée disponible </span>
                </div>
            </div>
            <div v-else class="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-6">
                <!-- TODO: sort by type with ordering -->
                <div
                    v-for="(files, type) in allFiles"
                    :key="type"
                    class="card-2 flex flex-col justify-between gap-10"
                >
                    <div class="w-fit">
                        <h4 class="text-0 inline font-medium">
                            {{ TEAM_FILES[type].name[locale] }}
                        </h4>
                        <InfoIcon :tooltip="TEAM_FILES[type].description[locale]" />
                    </div>

                    <div class="flex flex-col gap-4">
                        <FileInput
                            :model-value="files.find((file) => file.active === true)?.file"
                            :file="files.find((file) => file.active === true)"
                            :file-type="DOCUMENT"
                            :remove-callback="(_, { id }) => removeFile({ id })"
                            @update:model-value="
                                (file) => {
                                    if (file) uploadFile(file, type)
                                }
                            "
                        />
                        <LabelSimple
                            v-if="files.some((file) => !file.active)"
                            @click="showArchiveType[type] = true"
                        >
                            Voir les archives...
                        </LabelSimple>
                        <ModalPopup :show="showArchiveType[type]" @close="showArchiveType[type] = false">
                            <div v-for="file in files" :key="file.id">
                                <FileInput :model-value="file" :file-type="DOCUMENT" />
                            </div>
                        </ModalPopup>
                    </div>
                </div>
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import Zoom from '@/assets/img/3dicons/zoom.png'

    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import FileInput from '@/components/Input/FileInput.vue'
    // import FileInput from '@/components/Input/FileInput.vue'
    // import FilePreview from '@/components/Document/FilePreview.vue'

    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'
    import InfoIcon from '@/icons/InfoIcon.vue'

    import { getTeamFiles } from '@/graphql/queries/teams/getTeamFiles'
    import { deleteTeamFile } from '@/graphql/queries/teams/deleteTeamFile'

    // FIXME: find a fix for uploading with graphql
    // import { addTeamFile } from '@/graphql/queries/teams/addTeamFile'

    import { groupBy, isEmpty } from 'lodash'
    // import { ref, watch } from 'vue'
    // import { useClubsStore } from '@/store/clubs.store'
    import { TEAM_FILES } from '@/shared/types/team-files.enum'
    import { DOCUMENT } from '@/shared/assets/file-types'

    import { useI18n } from 'vue-i18n'
    import { ref } from 'vue'
    import $axios from '@/shared/config/axios.config'
    import { useQuery } from '@vue/apollo-composable'
    import { useMutation } from '@vue/apollo-composable'
    import { showErrorToast, showSuccessToast, showToastGraphQLError } from '@/utils/toast'

    const { locale } = useI18n({ useScope: 'global' })

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const { onError: onFilesFetchError, refetch } = useQuery(getTeamFiles, { id: props.club.id })
    onFilesFetchError((errors) => showToastGraphQLError(errors, "Échec de l'upload du fichier !"))

    const { mutate: removeFile, onDone, onError: onRemoveFileError } = useMutation(deleteTeamFile)
    onDone(() => showSuccessToast('Fichier supprimé 🗑️'))
    onRemoveFileError((errors) => showToastGraphQLError(errors, 'Échec de la suppression du fichier !'))

    const filesByType = (files) => {
        const byType = groupBy(files, 'type')
        for (const type of Object.keys(TEAM_FILES)) {
            byType[type] = byType[type] || []
        }
        return byType
    }

    const showArchiveType = ref(Object.fromEntries(Object.entries(TEAM_FILES).map(([key]) => [key, false])))

    const uploadFile = (file, type) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('teamId', props.club.id)
        formData.append('type', type)

        $axios
            .post('files/team-files', formData)
            .then(() => {
                showSuccessToast('Fichier uploadé 📁')
                refetch()
            })
            .catch((error) => {
                showErrorToast(error.message, { title: `Échec de l'upload de "${file.name}" !` })
            })
    }

    // FIXME: find a fix for uploading with graphql
    // const { mutate: addFile, onDone, onError } = useMutation(addTeamFile)
    // onDone(() => showSuccessToast('Fichier uploadé 📁'))
    // onError((errors) => {
    //     console.log(errors)
    //     showToastGraphQLError(errors, "Échec de l'upload du fichier !")
    // })
    // const uploadFile = (file, type) => {
    //     addFile({
    //         file: { file },
    //         createFile: {
    //             id: props.club.id,
    //             type,
    //         },
    //     })
    // }
</script>
