<template>
    <GraphQLQuery
        :query="getTeamRequests"
        :variables="{ id: club.id, filter: { state: PENDING } }"
        :update="(data) => data?.teamMembershipRequests"
    >
        <template #default="{ data: requests }">
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
                                Formulaire d'adhésion de
                                {{ shownRequest?.user ? fullname(shownRequest?.user) : '' }}
                            </div>
                            <div class="flex flex-col gap-4">
                                <div>
                                    <div class="text-base text-gray-400/80">Rôle souhaité</div>
                                    <div class="text-0 text-xl">
                                        {{ clubRoleNames[shownRequest?.role ?? '']?.[locale] ?? '' }}
                                    </div>
                                </div>
                                <div
                                    v-for="[field, value] in Object.entries(
                                        shownRequest?.formSubmission ?? {},
                                    )"
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
                                            {{ statusNames[shownRequest?.state ?? '']?.[locale] ?? '' }}
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
                                <button
                                    class="button-grey flex items-center"
                                    @click="showRequestForm = false"
                                >
                                    Annuler
                                </button>
                                <button class="button-red flex items-center gap-2" @click="refusing = true">
                                    <i class="fa fa-xmark" />
                                    <div>Refuser</div>
                                </button>
                                <button
                                    class="button-blue flex items-center gap-2"
                                    @click="
                                        handleMembershipRequest({
                                            id: shownRequest.id,
                                            updateRequest: { state: APPROVED },
                                        })
                                    "
                                >
                                    <i class="fa fa-check" />
                                    <div>Accepter</div>
                                </button>
                            </div>
                            <button v-else class="button-grey mt-10 self-center" @click="close">
                                Fermer
                            </button>
                        </template>
                        <template v-else>
                            <div class="mb-6 text-2xl">
                                Refus de l'adhésion de {{ fullname(shownRequest?.user) }}
                            </div>
                            <div class="flex flex-col gap-4">
                                <div class="flex flex-col">
                                    <div class="text-base text-gray-400/80">Rôle souhaité</div>
                                    <div class="text-0 text-xl">
                                        {{ clubRoleNames[shownRequest?.role ?? '']?.[locale] ?? '' }}
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
                                <button class="button-grey" @click="refusing = false">Annuler</button>
                                <button
                                    class="button-red"
                                    @click="
                                        handleMembershipRequest({
                                            id: shownRequest.id,
                                            updateRequest: { state: REJECTED, message: refuseReason },
                                        })
                                    "
                                >
                                    Confirmer le refus
                                </button>
                            </div>
                        </template>
                    </div>
                </template>
            </ModalPopup>
            <template v-if="requests.length">
                <div
                    v-for="request in requests"
                    :key="request.id"
                    class="text-0 flex items-center justify-between py-2"
                >
                    <div class="flex items-center gap-4">
                        <ProfileAvatar
                            :avatar="request.user.avatar"
                            :name="fullname(request.user)"
                            :size="3.5"
                        />
                        <div class="flex flex-col">
                            <div class="flex gap-1.5">
                                <div class="text-lg font-semibold">
                                    {{ fullname(request.user) }}
                                </div>
                                <div>(comme {{ clubRoleNames[request.role][locale] }})</div>
                            </div>
                            <div class="flex gap-1.5 text-sm">
                                <div class="flex gap-1">
                                    <div>Demandé</div>
                                    <TipRelativeDate :date="request.createdAt" />
                                </div>
                                <template v-if="request.state === APPROVED">
                                    <div>•</div>
                                    <div class="flex gap-1">
                                        <div class="text-2">{{ statusNames[APPROVED][locale] }}</div>
                                        <TipRelativeDate :date="request.handledAt" />
                                        <div>par {{ request.handledBy.firstname.split(' ')[0] }}</div>
                                    </div>
                                </template>
                                <template v-else-if="request.state === REJECTED">
                                    <div>•</div>
                                    <div class="flex gap-1">
                                        <div class="text-2">{{ statusNames[REJECTED][locale] }}</div>
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
                            <div>{{ statusNames[APPROVED][locale] }}</div>
                        </template>
                        <template v-else-if="request.state === REJECTED">
                            <i class="fa fa-xmark" />
                            <div>{{ statusNames[REJECTED][locale] }}</div>
                        </template>
                        <template v-else-if="request.state === PENDING">
                            <i class="fa fa-envelope" />
                            <div>{{ statusNames[PENDING][locale] }}</div>
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
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'

    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    import Megaphone from '@/assets/img/3dicons/megaphone.png'

    import { capitalize } from 'lodash'
    import { ref } from 'vue'

    import { getTeamRequests } from '@/graphql/queries/teams/getTeamRequests'
    import { handleRequest } from '@/graphql/queries/teams/handleRequest'

    import { PENDING, APPROVED, REJECTED, statusNames } from '@/shared/types/club-requests.enum'
    import { clubRoleNames } from '@/shared/types/club-roles.enum'
    import { fullname } from '@/utils/users'

    import { useI18n } from 'vue-i18n'
    import { useMutation } from '@vue/apollo-composable'
    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast'

    const { locale } = useI18n({ useScope: 'global' })

    defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const showRequestForm = ref(false)
    const shownRequest = ref(null)

    const refusing = ref(false)
    const refuseReason = ref('')

    const { mutate: handleMembershipRequest, onDone, onError } = useMutation(handleRequest)
    onDone(() => {
        showSuccessToast(
            shownRequest.value?.user
                ? `Demande de ${fullname(shownRequest.value?.user)} traitée`
                : 'Demande traitée',
        )
        showRequestForm.value = false
    })
    onError(showToastGraphQLError)
</script>
