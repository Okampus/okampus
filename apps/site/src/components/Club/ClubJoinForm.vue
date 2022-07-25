<template>
    <ModalPopup
        :show="show"
        @close="emit('update:show', false)"
        @closed="
            () => {
                formData = {}
                emit('closed')
            }
        "
    >
        <template #default="{ close }">
            <div class="card flex flex-col items-center justify-center py-8 px-10">
                <div class="text-2xl font-semibold">Vous vous apprêtez à rejoindre {{ club.name }} !</div>
                <div class="text-2 text-sm">Formulaire d'adhésion de {{ club.name }}.</div>
                <FormKit
                    id="join-club"
                    ref="joinForm"
                    v-model="formData"
                    type="form"
                    form-class="flex flex-col mt-6 max-w-lg"
                    :actions="false"
                    @submit="
                        (data) => {
                            joinFormSubmit(data)
                            close()
                        }
                    "
                >
                    <FormKit
                        label="Votre rôle souhaité"
                        type="radio"
                        name="role"
                        :validation="[['required']]"
                        help="Quel rôle souhaitez-vous obtenir ?"
                        :options="roles"
                    />
                    <FormKit
                        type="text"
                        name="discord"
                        label="Votre ID Discord (avec le #)"
                        :validation="[
                            ['required'],
                            ['matches', /^(?!(here|everyone))^(?!.*(discord|```)).[^\@\#\:]{2,32}#\d{4}$/s],
                        ]"
                        :validation-messages="{
                            matches: 'ID Discord invalide.',
                        }"
                        help="ex. Jérôme#4555, Arno#1234..."
                    />
                    <FormKit
                        type="text"
                        name="raison"
                        label="La raison de votre adhésion"
                        help="Décrivez en quelques mots la raison de votre adhésion."
                    />
                </FormKit>

                <FormKitRenderer :schema="club?.membershipRequestForm?.form ?? []" />

                <div class="mt-6 flex gap-4 self-end">
                    <button class="button-red" @click="close">Annuler</button>
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
    import FormKitRenderer from '@/components/FormKit/FormKitRenderer.vue'
    import { FormKit } from '@formkit/vue'

    import { ref } from 'vue'

    import { clubRoleNames } from '@/shared/types/club-roles.enum'
    import { i18n } from '@/shared/modules/i18n'
    import { useClubsStore } from '@/store/clubs.store'
    import { emitter } from '@/shared/modules/emitter'

    const props = defineProps({
        show: {
            type: Boolean,
            required: true,
        },
        club: {
            type: Object,
            required: true,
        },
    })

    const emit = defineEmits(['update:show', 'closed', 'submitted'])

    const joinForm = ref(null)
    const formData = ref({})

    const roles = Object.entries(clubRoleNames).map(([value, name]) => ({
        value,
        label: name[i18n.global.locale],
    }))

    const clubs = useClubsStore()
    const joinFormSubmit = async (data) => {
        const { role, ...meta } = data

        await clubs
            .postMembershipRequest(props.club.teamId, { role, meta })
            .then(() => {
                emit('submitted')
                // clubList.value.find((club) => club.teamId === props.club.value).membership = IS_WAITING
                emitter.emit('show-toast', {
                    message: "Votre demande d'adhésion a bien été envoyée !",
                    type: 'success',
                })
            })
            .catch((err) => {
                emitter.emit('show-toast', {
                    message: `Erreur: ${err.message}`,
                    type: 'error',
                })
            })
    }
</script>
