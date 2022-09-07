<template>
    <GraphQLQuery
        :query="getTeamReceipts"
        :variables="{ teamId: club.teamId }"
        :update="(data) => data?.teamReceipts"
    >
        <template #default="{ data: teamReceipts }">
            <div>
                <div></div>
                <div class="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6">
                    <!-- TODO: sort by type with ordering -->
                    <div
                        v-for="file in teamReceipts"
                        :key="file.id"
                        class="card-2 flex flex-col justify-between gap-10"
                        @click="uploadReceipt"
                    >
                        {{ file }}
                        <i class="fa fa-xmarl" @click="removeFile" />
                    </div>
                </div>
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import { useQuery } from '@vue/apollo-composable'
    import { useMutation } from '@vue/apollo-composable'

    import $axios from '@/shared/config/axios.config'

    import { getTeamReceipts } from '@/graphql/queries/teams/getTeamReceipts'
    import { deleteTeamReceipt } from '@/graphql/queries/teams/deleteTeamReceipt'

    import { showErrorToast, showSuccessToast, showToastGraphQLError } from '@/utils/toast'
    import { isNil } from 'lodash'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const { onError: onFilesFetchError, refetch } = useQuery(getTeamReceipts, { id: props.club.id })
    onFilesFetchError((errors) => showToastGraphQLError(errors, "Échec de l'upload du fichier !"))

    const { mutate: removeFile, onDone, onError: onRemoveFileError } = useMutation(deleteTeamReceipt)
    onDone(() => showSuccessToast('Fichier supprimé 🗑️'))
    onRemoveFileError((errors) => showToastGraphQLError(errors, 'Échec de la suppression du fichier !'))

    const uploadReceipt = (file, createTeamReceipt) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('teamId', props.club.id)

        for (const [key, value] of Object.entries(createTeamReceipt))
            if (!isNil(value)) formData.append(key, value)

        $axios
            .post('files/team-receipts', formData)
            .then(() => {
                showSuccessToast('Fichier uploadé 📁')
                refetch()
            })
            .catch((error) => {
                showErrorToast(error.message, { title: `Échec de l'upload de "${file.name}" !` })
            })
    }
</script>
