<template>
    <ModalPopup :show="show" @close="$emit('update:show', false)" @closed="$emit('closed')">
        <template #default="{ close }">
            <div class="card flex flex-col">
                <div class="mb-6 text-2xl">Formulaire d'adhésion à {{ request?.team?.name }}</div>
                <div class="flex flex-col gap-4">
                    <div>
                        <div class="text-base text-gray-400/80">Rôle souhaité</div>
                        <div class="text-0 text-xl">
                            {{ clubRoleNames?.[request?.role]?.[$i18n.locale] }}
                        </div>
                    </div>

                    <div v-for="[field, value] in Object.entries(request?.formSubmission ?? {})" :key="field">
                        <div class="text-base text-gray-400/80">
                            {{ capitalize(field) }}
                        </div>
                        <div class="text-0 text-xl">{{ value }}</div>
                    </div>

                    <div>
                        <div class="text-base text-gray-400/80">
                            <div>Statut</div>
                            <div
                                class="text-0 text-xl"
                                :class="{
                                    '!text-green-500': request?.state === APPROVED,
                                    '!text-red-500': request?.state === REJECTED,
                                    '!text-gray-500/90': request?.state === PENDING,
                                }"
                            >
                                {{ statusNames?.[request?.state]?.[$i18n.locale] }}
                            </div>
                        </div>
                    </div>

                    <div v-if="request?.state === REJECTED" class="flex flex-col">
                        <div class="text-lg text-gray-400/80">Raison du refus</div>
                        <div class="text-0 text-2xl" :class="!request?.handledMessage ? 'italic' : ''">
                            {{ request?.handledMessage || 'Pas de raison donnée.' }}
                        </div>
                    </div>
                </div>

                <button class="button-grey mt-10 self-center" @click="close">Fermer</button>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'

    import { capitalize } from 'lodash'

    import { clubRoleNames } from '@/shared/types/club-roles.enum'
    import { APPROVED, REJECTED, PENDING, statusNames } from '@/shared/types/club-requests.enum'

    defineProps({
        show: {
            type: Boolean,
            default: false,
        },
        request: {
            type: Object,
            default: null,
        },
    })

    defineEmits(['update:show', 'closed'])
</script>
