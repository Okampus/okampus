<template>
    <ModalPopup :show="show" @close="emit('update:show', false)" @closed="emit('closed')">
        <template #default="{ close }">
            <div class="card flex flex-col items-center justify-center gap-6 py-8 px-10">
                <h1 class="mb-12 text-center font-semibold">
                    Vous vous apprêtez à rejoindre {{ club?.name }} 🎉 !
                </h1>

                <FormKit
                    ref="joinForm"
                    type="form"
                    :actions="false"
                    @submit="
                        join({
                            id: club?.id,
                            request: {
                                role: $event.role ?? MEMBER,
                                originalFormId: club?.membershipRequestForm?.id,
                                formSubmission: $event,
                            },
                        })
                    "
                >
                    <FormKitSchema :schema="club?.membershipRequestForm?.form ?? DEFAULT_JOIN_FORM_SCHEMA" />
                </FormKit>

                <div class="flex gap-4 self-end">
                    <button class="button-grey" @click="close">Annuler</button>
                    <button class="button-blue flex items-center gap-2" @click="joinForm.node.submit()">
                        <i class="fa fa-envelope text-lg" />
                        <div>Envoyer ma demande</div>
                    </button>
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import { FormKitSchema } from '@formkit/vue'

    import { useMutation } from '@vue/apollo-composable'

    import { ref } from 'vue'

    import { joinTeam } from '@/graphql/queries/teams/joinTeam'

    import { MEMBER } from '@/shared/types/club-roles.enum.js'
    import { DEFAULT_JOIN_FORM_SCHEMA } from '@/shared/assets/default-schemas'

    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast'

    defineProps({
        show: {
            type: Boolean,
            required: true,
        },
        club: {
            type: Object,
            default: null,
        },
    })

    const emit = defineEmits(['update:show', 'closed'])
    const joinForm = ref(null)

    const { mutate: join, onDone, onError } = useMutation(joinTeam)

    onDone(() => {
        emit('update:show', false)
        showSuccessToast('Votre demande a bien été envoyée ✉️')
    })

    onError(showToastGraphQLError)
</script>
