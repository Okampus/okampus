<template>
    <FormPopUp
        :submit="(report) => createReport({ id: content.id, report })"
        :show="showReport"
        :form-schema="reportFormSchema"
        @close="emit('close')"
    />
</template>

<script setup>
    import { noop } from 'lodash'

    import { useMutation } from '@vue/apollo-composable'

    import { report } from '@/graphql/queries/interactions/reportContent'
    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast.js'
    import FormPopUp from '../Form/FormPopUp.vue'

    defineProps({
        showReport: {
            type: Boolean,
            default: false,
        },
        content: {
            type: Object,
            default: noop,
        },
    })

    const emit = defineEmits(['close'])

    const reportCharLimit = [20, 1000]
    const reportFormSchema = [
        {
            $el: 'h1',
            children: ['Signaler ce contenu 🚩'],
        },
        {
            $formkit: 'textarea',
            name: 'reason',
            label: 'Raison du signalement',
            validation: `required|length:${reportCharLimit.join(',')}`,
            rows: '6',
            validationVisibility: 'dirty',
            validationMessages: {
                required: 'Vous devez expliquer la raison de votre signalement.',
                length: `Votre signalement doit faire entre ${reportCharLimit[0]} et ${reportCharLimit[1]} caractères.`,
            },
        },
    ]

    const { mutate: createReport, onDone, onError } = useMutation(report)

    onDone(() => {
        showSuccessToast('Votre signalement a bien été pris en compte.')
        emit('close')
    })
    onError(showToastGraphQLError)
</script>
