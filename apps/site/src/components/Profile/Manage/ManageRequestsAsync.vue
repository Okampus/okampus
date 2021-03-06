<template>
    <div class="card-2 text-0 divide-y divide-gray-500/40">
        <ModalPopup
            :show="showRequestForm"
            @close="showRequestForm = false"
            @closed="
                () => {
                    shownRequest = null
                    refusing = false
                }
            "
        >
            <template #default="{ close }">
                <div class="card flex flex-col">
                    <template v-if="!refusing">
                        <div class="mb-6 text-2xl">
                            Formulaire d'adhésion de {{ fullname(shownRequest?.user) }}
                        </div>
                        <div class="flex flex-col gap-4">
                            <div>
                                <div class="text-base text-gray-400/80">Rôle souhaité</div>
                                <div class="text-0 text-xl">
                                    {{ clubRoleNames[shownRequest?.role ?? '']?.[$i18n.locale] ?? '' }}
                                </div>
                            </div>
                            <div
                                v-for="[field, value] in Object.entries(shownRequest?.meta ?? {})"
                                :key="field"
                            >
                                <div class="text-base text-gray-400/80">{{ capitalize(field) }}</div>
                                <div class="text-0 text-xl">{{ value }}</div>
                            </div>
                            <div>
                                <div class="text-base text-gray-400/80">
                                    <div>Statut</div>
                                    <div
                                        class="text-0 text-xl"
                                        :class="{
                                            '!text-green-500': shownRequest?.state === APPROVED,
                                            '!text-red-500': shownRequest?.state === REJECTED,
                                            '!text-gray-500/90': shownRequest?.state === PENDING,
                                        }"
                                    >
                                        {{ statusNames[shownRequest?.state ?? '']?.[$i18n.locale] ?? '' }}
                                    </div>
                                </div>
                            </div>
                            <div v-if="shownRequest?.state === REJECTED" class="flex flex-col">
                                <div class="text-lg text-gray-400/80">Raison du refus</div>
                                <div
                                    class="text-0 text-2xl"
                                    :class="!shownRequest.handledMessage ? 'italic' : ''"
                                >
                                    {{ shownRequest.handledMessage || 'Pas de raison donnée.' }}
                                </div>
                            </div>
                        </div>
                        <div v-if="shownRequest?.state === PENDING" class="mt-6 flex gap-4 self-end">
                            <div class="button-red flex items-center gap-2" @click="refusing = true">
                                <i class="fa fa-xmark" />
                                <div>Refuser</div>
                            </div>
                            <div
                                class="button-blue flex items-center gap-2"
                                @click="
                                    () => {
                                        approve()
                                        close()
                                    }
                                "
                            >
                                <i class="fa fa-check" />
                                <div>Accepter</div>
                            </div>
                        </div>
                        <div v-else class="button-blue mt-10 self-center" @click="close">Fermer</div>
                    </template>
                    <template v-else>
                        <div class="mb-6 text-2xl">
                            Refus de l'adhésion de {{ fullname(shownRequest?.user) }}
                        </div>
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col">
                                <div class="text-base text-gray-400/80">Rôle souhaité</div>
                                <div class="text-0 text-xl">
                                    {{ clubRoleNames[shownRequest?.role ?? '']?.[$i18n.locale] ?? '' }}
                                </div>
                            </div>
                            <div
                                v-for="[field, value] in Object.entries(shownRequest?.meta ?? {})"
                                :key="field"
                                class="flex flex-col"
                            >
                                <div class="text-base text-gray-400/80">{{ capitalize(field) }}</div>
                                <div class="text-0 text-xl">{{ value }}</div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <FormKit
                                v-model="refuseReason"
                                type="textarea"
                                rows="4"
                                name="reason"
                                label="Raison du refus"
                            />
                        </div>
                        <div class="mt-8 flex gap-4 self-end">
                            <div class="button-grey" @click="refusing = false">Annuler</div>
                            <div
                                class="button-red"
                                @click="
                                    () => {
                                        refuse()
                                        close()
                                    }
                                "
                            >
                                Confirmer le refus
                            </div>
                        </div>
                    </template>
                </div>
            </template>
        </ModalPopup>
        <template v-if="requests.length">
            <div
                v-for="request in requests"
                :key="request.teamMembershipRequestId"
                class="flex items-center justify-between py-2"
            >
                <div class="flex items-center gap-4">
                    <ProfileAvatar :avatar="request.user.avatar" :name="fullname(request.user)" :size="3.5" />
                    <div class="flex flex-col">
                        <div class="flex gap-1.5">
                            <div class="text-lg font-semibold">
                                {{ fullname(request.user) }}
                            </div>
                            <div class="text-1">
                                (pour le rôle de {{ clubRoleNames[request.role][$i18n.locale] }})
                            </div>
                        </div>
                        <div class="flex gap-1.5 text-sm">
                            <div class="flex gap-1">
                                <div class="text-2">Demandé</div>
                                <TipRelativeDate :date="request.createdAt" />
                            </div>
                            <template v-if="request.state === APPROVED">
                                <div>•</div>
                                <div class="flex gap-1">
                                    <div class="text-2">{{ statusNames[APPROVED][$i18n.locale] }}</div>
                                    <TipRelativeDate :date="request.handledAt" />
                                    <div>par {{ request.handledBy.firstname.split(' ')[0] }}</div>
                                </div>
                            </template>
                            <template v-else-if="request.state === REJECTED">
                                <div>•</div>
                                <div class="flex gap-1">
                                    <div class="text-2">{{ statusNames[REJECTED][$i18n.locale] }}</div>
                                    <TipRelativeDate :date="request.handledAt" />
                                    <div>par {{ request.handledBy.firstname.split(' ')[0] }}</div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <div
                    class="flex w-36 cursor-pointer items-center justify-center gap-2 rounded-xl py-1 px-3 text-white"
                    :class="{
                        'bg-green-500 hover:bg-green-600': request.state === APPROVED,
                        'bg-red-500 hover:bg-red-600': request.state === REJECTED,
                        'bg-gray-500/50 hover:bg-gray-600/50': request.state === PENDING,
                    }"
                    @click="
                        () => {
                            showRequestForm = true
                            shownRequest = request
                        }
                    "
                >
                    <template v-if="request.state === APPROVED">
                        <i class="fa fa-check" />
                        <div>{{ statusNames[APPROVED][$i18n.locale] }}</div>
                    </template>
                    <template v-else-if="request.state === REJECTED">
                        <i class="fa fa-xmark" />
                        <div>{{ statusNames[REJECTED][$i18n.locale] }}</div>
                    </template>
                    <template v-else-if="request.state === PENDING">
                        <i class="fa fa-envelope" />
                        <div>{{ statusNames[PENDING][$i18n.locale] }}</div>
                    </template>
                </div>
            </div>
        </template>

        <div v-else class="text-0 flex flex-col items-center gap-6 pb-4">
            <img class="h-40 w-40" :src="Megaphone" />

            <div class="text-center">
                <div class="text-3xl font-semibold">Aucune demande d'adhésion pour le moment</div>
                <div class="text-2 text-xl">
                    Invitez des amis à rejoindre {{ club.name }} depuis votre page !
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    import Megaphone from '@/assets/img/3dicons/megaphone.png'

    import { capitalize } from 'lodash'
    import { ref, watchEffect } from 'vue'

    import { useAuthStore } from '@/store/auth.store'
    import { useClubsStore } from '@/store/clubs.store'
    import { emitter } from '@/shared/modules/emitter'

    import { PENDING, APPROVED, REJECTED, statusNames } from '@/shared/types/club-requests.enum'
    import { clubRoleNames } from '@/shared/types/club-roles.enum'
    import { fullname } from '@/utils/users'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const auth = useAuthStore()
    const clubs = useClubsStore()

    const requests = ref(null)
    const showRequestForm = ref(false)
    const shownRequest = ref(null)

    const refusing = ref(false)
    const refuseReason = ref('')

    const approve = () => {
        clubs
            .handleRequest(shownRequest.value.teamMembershipRequestId, { state: APPROVED })
            .then(() => {
                const request = requests.value.find(
                    (request) =>
                        request.teamMembershipRequestId === shownRequest.value.teamMembershipRequestId,
                )

                request.state = APPROVED
                request.handledBy = auth.user
                request.handledAt = new Date().toISOString()

                emitter.emit('show-toast', {
                    message: `La demande d'adhésion de ${fullname(
                        shownRequest.value.user,
                    )} a bien été approuvée.`,
                    type: 'success',
                })
            })
            .catch((err) => {
                emitter.emit('show-toast', {
                    message: `Une erreur est survenue lors de l'approbation de la demande d'adhésion de ${fullname(
                        shownRequest.value.user,
                    )}: ${err.message}`,
                    type: 'error',
                })
            })
    }

    const refuse = () => {
        clubs
            .handleRequest(shownRequest.value.teamMembershipRequestId, {
                state: REJECTED,
                handledMessage: refuseReason.value,
            })
            .then(() => {
                const request = requests.value.find(
                    (request) =>
                        request.teamMembershipRequestId === shownRequest.value.teamMembershipRequestId,
                )

                request.state = REJECTED
                request.handledBy = auth.user
                request.handledAt = new Date().toISOString()
                request.handledMessage = refuseReason.value

                refuseReason.value = ''
                emitter.emit('show-toast', {
                    message: `La demande d'adhésion de ${fullname(
                        shownRequest.value.user,
                    )} a bien été refusée.`,
                    type: 'success',
                })
            })
            .catch((err) => {
                emitter.emit('show-toast', {
                    message: `Une erreur est survenue lors du refus de la demande d'adhésion de ${fullname(
                        shownRequest.value.user,
                    )}: ${err.message}`,
                    type: 'error',
                })
            })
    }

    await clubs.getRequestsOfClub(props.club.teamId).then((membershipRequests) => {
        requests.value = membershipRequests
    })

    watchEffect(async () => {
        await clubs.getRequestsOfClub(props.club.teamId).then((membershipRequests) => {
            requests.value = membershipRequests
        })
    })
</script>
