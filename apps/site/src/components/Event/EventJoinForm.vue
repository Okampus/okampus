<template>
    <ModalPopup :show="show" @close="emit('update:show', false)" @closed="emit('closed')">
        <template #default="{ close }">
            <div class="card flex flex-col items-center justify-center gap-6 py-8 px-10">
                <h1 class="mb-12 text-center font-semibold">
                    Vous vous apprêtez à vous inscrire à l'événement {{ event?.name }} 🎉 !
                </h1>

                <FormKit
                    ref="joinForm"
                    type="form"
                    :actions="false"
                    @submit="
                        register({
                            id: event?.id,
                            registration: {
                                status: $event.sure ?? 'Sure',
                                originalFormId: event?.registrationForm?.id,
                                formSubmission: $event,
                            },
                        })
                    "
                >
                    <FormKitSchema
                        :schema="
                            event?.userRegistration?.status === 'Absent'
                                ? EVENT_REGISTRATION_STATUS_FORM_SCHEMA
                                : event?.registrationForm?.form ?? DEFAULT_EVENT_REGISTRATION_FORM_SCHEMA
                        "
                    />
                </FormKit>

                <div class="flex gap-4 self-end">
                    <button class="button-grey" @click="close">Annuler</button>
                    <button class="button-green flex items-center gap-2" @click="joinForm.node.submit()">
                        <!-- <i class="fa fa-envelope text-lg" /> -->
                        <div>Je m'inscris !</div>
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

    import { emitter } from '@/shared/modules/emitter'
    import { registerEvent } from '@/graphql/queries/events/registerEvent'

    import {
        DEFAULT_EVENT_REGISTRATION_FORM_SCHEMA,
        EVENT_REGISTRATION_STATUS_FORM_SCHEMA,
    } from '@/shared/assets/default-schemas'

    import { showToastGraphQLError } from '@/utils/errors.js'

    defineProps({
        show: {
            type: Boolean,
            required: true,
        },
        event: {
            type: Object,
            default: null,
        },
    })

    const emit = defineEmits(['update:show', 'closed'])
    const joinForm = ref(null)

    const { mutate: register, onDone, onError } = useMutation(registerEvent)

    onDone(() => {
        emitter.emit('show-toast', {
            message: "Votre vous êtres bien inscrit à l'évenement !",
            type: 'success',
        })
        emit('update:show', false)
    })

    onError(showToastGraphQLError)
</script>
