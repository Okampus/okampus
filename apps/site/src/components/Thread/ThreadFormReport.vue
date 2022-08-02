<template>
    <ModalPopup :show="showReport">
        <template #default="{ close }">
            <div class="card flex flex-col gap-2">
                <h1 class="mb-4 text-center font-bold">Signaler ce contenu</h1>
                <AppTitle icon="fa fa-bullhorn" title="Raison" />

                <!-- TODO: Change editor to basic textarea ? -->
                <FormKit
                    ref="reportForm"
                    type="form"
                    :actions="false"
                    @submit="(state) => createReport({ id: content.id, report: { reason: state.report } })"
                >
                    <FormKit
                        type="textarea"
                        name="report"
                        :validation="`required|length:${reportCharLimit.join(',')}`"
                        rows="6"
                        outer-class="!mb-0"
                        validation-visibility="dirty"
                        :validation-messages="{
                            required: 'Vous devez expliquer la raison de votre signalement.',
                            length: `Votre signalement doit faire entre ${reportCharLimit[0]} et ${reportCharLimit[1]} caractères.`,
                        }"
                    />
                </FormKit>

                <button
                    class="button-blue font-semibold"
                    @click="
                        () => {
                            trigger = close
                            reportForm.node.submit()
                        }
                    "
                >
                    Signaler
                </button>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import AppTitle from '@/components/App/AppTitle.vue'

    import { FormKit } from '@formkit/vue'
    import { noop } from 'lodash'

    import { useMutation } from '@vue/apollo-composable'

    import { report } from '@/graphql/queries/interactions/reportContent'
    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast.js'
    import { ref } from 'vue'

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

    const reportForm = ref(null)
    const trigger = ref(() => {})
    const reportCharLimit = [20, 1000]

    const { mutate: createReport, onDone, onError } = useMutation(report)

    onDone(() => {
        showSuccessToast('Votre signalement a bien été pris en compte.')
        trigger.value()
    })
    onError(showToastGraphQLError)
</script>
