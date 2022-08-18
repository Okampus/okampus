<template>
    <GraphQLQuery
        :query="getEvent"
        :variables="{ id: parseInt(route.params.eventId) }"
        :update="(data) => data?.eventById"
    >
        <template #default="{ data: event }">
            <div class="text-0 centered-container-padded card-2 flex flex-col gap-10 md:my-8 md-max:p-0">
                <div class="flex flex-col gap-10 md:flex-row">
                    <div class="relative h-56 w-full shrink-0 md:h-72 md:max-w-[40rem]">
                        <ProfileBanner
                            class="h-full"
                            :name="event.shortDescription"
                            :data="event.team.category"
                            :rounded-top="false"
                        />

                        <div
                            class="absolute inset-0 m-auto flex h-60 flex-col items-center justify-center gap-4 text-center text-white"
                        >
                            <div v-if="timeUntil(event.start) > 0">
                                <vue-countdown
                                    v-slot="{ days, hours, minutes, seconds }"
                                    tag="div"
                                    :time="timeUntil(event.start)"
                                >
                                    <div class="flex flex-col gap-4">
                                        <div class="flex items-center justify-center gap-2">
                                            <div v-if="days" class="flex w-14 flex-col">
                                                <div>Jour{{ days ? 's' : '' }}</div>
                                                <div class="text-2xl">
                                                    {{ days.toString().padStart(2, '0') }}
                                                </div>
                                            </div>
                                            <div v-if="days" class="mt-4 text-xl font-semibold">:</div>
                                            <div v-if="hours" class="flex w-20 flex-col">
                                                <div>Heures</div>
                                                <div class="text-2xl">
                                                    {{ hours.toString().padStart(2, '0') }}
                                                </div>
                                            </div>
                                            <div v-if="hours" class="mt-4 text-xl font-semibold">:</div>
                                            <div v-if="minutes" class="flex w-20 flex-col">
                                                <div>Minutes</div>
                                                <div class="text-2xl">
                                                    {{ minutes.toString().padStart(2, '0') }}
                                                </div>
                                            </div>
                                            <div v-if="minutes" class="mt-4 text-xl font-semibold">:</div>
                                            <div class="flex w-20 flex-col">
                                                <div class="tracking-tighter">Secondes</div>
                                                <div class="text-2xl">
                                                    {{ seconds.toString().padStart(2, '0') }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="text-xl">
                                            Restant{{ days === 0 ? 'e' : '' }}s avant le début de l'événement
                                        </div>
                                    </div>
                                </vue-countdown>
                            </div>
                            <div v-else class="text-xl">Événement terminé !</div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-6 md-max:px-8">
                        <div class="text-3xl font-bold">{{ event.name }}</div>
                        <TeamActivity :team="event.team" action-text="Créé" :action-at="event.createdAt">
                            <template #subtitle>
                                <div class="flex gap-1">
                                    Publié
                                    <TipRelativeDate :date="event.createdAt" />
                                    •
                                    <template v-if="timeUntil(event.start) > 0">
                                        Commence
                                        <TipRelativeDate :date="event.start" :limit="false" />
                                    </template>
                                    <template v-else>
                                        A eu lieu
                                        <TipRelativeDate :date="event.start" :limit="false" />
                                    </template>
                                </div>
                            </template>
                        </TeamActivity>
                        <div class="flex justify-between">
                            <div class="ml-1 flex flex-col gap-1">
                                <div class="flex items-center gap-4">
                                    <div class="w-6">💶</div>
                                    <div class="font-semibold">
                                        {{ event.price === 0 ? 'Gratuit' : `Prix : ${event.price}€` }}
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div class="w-6">📅</div>
                                    <div class="flex flex-col gap-1 tracking-tight">
                                        <div>{{ getDateRangeString(event.start, event.end) }}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="w-6">📍</div>
                                    <div>{{ event.location }}</div>
                                </div>
                            </div>
                        </div>

                        <div v-if="event.registrations.length > 0" class="flex items-center">
                            <AvatarGroup
                                spacing-class="-space-x-2"
                                :entities="
                                    event.registrations.map((registration) => ({
                                        id: registration.user.id,
                                        firstname: registration.user.firstname,
                                        lastname: registration.user.lastname,
                                        avatar: registration.user.avatar,
                                        status: registration.status,
                                    }))
                                "
                                :shown-count="registrationShowLimit"
                                :show-presence="true"
                            />
                        </div>
                        <div v-else class="text- italic">Il n'y a personne d'inscrit pour l'instant.</div>
                        <button
                            v-if="isAdmin"
                            class="button-blue w-[15rem] rounded-full py-1 px-4 text-lg font-semibold"
                            @click="showAdmin = true"
                        >
                            Gérer l'événement
                        </button>
                    </div>

                    <FormPopUp
                        v-model:show="showRegistrationForm"
                        :submit="
                            (data) =>
                                register({
                                    id: event?.id,
                                    registration: {
                                        status: data.sure ?? 'Sure',
                                        originalFormId: event?.registrationForm?.id,
                                        formSubmission: data,
                                    },
                                })
                        "
                        :form-schema="
                            event?.userRegistration?.status === 'Absent'
                                ? EVENT_REGISTRATION_STATUS_FORM_SCHEMA
                                : event?.registrationForm?.form ?? DEFAULT_EVENT_REGISTRATION_FORM_SCHEMA
                        "
                        :form-data="{ event }"
                    />

                    <ModalPopup :show="showAdmin" @close="showAdmin = false">
                        <template #default="{ close }">
                            <div
                                class="card-0 flex w-[48rem] flex-col items-center justify-center py-8 px-10"
                            >
                                <div class="text-2xl font-semibold">
                                    Voici l'onglet de gestion de
                                    <span class="font-bold">{{ event.shortDescription }}</span>
                                </div>
                                <div class="text-2 text-sm">
                                    Gérer la présence des membres, les diverses infos de l'évenement ...
                                </div>
                                <table v-if="event.registrations.length > 0" class="mt-8 flex flex-col gap-2">
                                    <thead class="flex items-center gap-2">
                                        <tr class="w-56">
                                            Invité
                                        </tr>
                                        <tr class="w-30">
                                            Présence
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="registration in event.registrations"
                                            :key="registration.id"
                                            class="border-grey-600 flex h-8 items-center gap-2 even:border-y-2"
                                        >
                                            <td class="flex w-56 items-center gap-2 truncate">
                                                <ProfileAvatar
                                                    :avatar="registration.user.avatar"
                                                    :name="fullname(registration.user)"
                                                    :size="2"
                                                />
                                                <p>{{ fullname(registration.user) }}</p>
                                            </td>
                                            <!-- <td class="w-30">
                                                 :choices="['Présent', 'Absent']"
                                            </td> -->
                                            <td>
                                                <button
                                                    class="button-red py-1 px-2"
                                                    @click="() => unregister(registration.id)"
                                                >
                                                    Désinscrire
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p v-else class="mt-4">Personne n'est encore inscrit à l'évenement</p>
                                <div class="mt-6 flex gap-4 self-end">
                                    <button class="button-red" @click="close">Fermer</button>
                                </div>
                            </div>
                        </template>
                    </ModalPopup>
                </div>

                <!--
                <div class="flex flex-col gap-2">
                    <div class="mb-2 text-2xl font-semibold text-0">Informations</div>
                    <div class="flex gap-3 items-center">
                        <div class="text-2">Requis pour l'événement :</div>
                        <div :class="{ 'italic text-sm': !event.preconditions }">
                            {{ event.preconditions || 'Pas de prérequis' }}
                        </div>
                    </div>
                    <div class="flex gap-3 items-center">
                        <div class="text-2">Point de rendez-vous :</div>
                        <div :class="{ 'italic text-sm': !event.meetingPoint }">
                            {{ event.meetingPoint || 'Pas de point de rendez-vous' }}
                        </div>
                    </div>
                </div> -->

                <div class="text-lg md-max:px-8">{{ event.description }}</div>

                <div class="flex flex-wrap justify-center gap-2 md-max:mb-6">
                    <button
                        v-if="event.userRegistration && event.userRegistration.status !== 'Absent'"
                        class="button-red rounded-full py-1 px-4 text-lg font-semibold"
                        @click="() => unregister({ id: event.userRegistration.id })"
                    >
                        Me désinscrire
                    </button>
                    <button
                        v-else-if="event.userRegistration && event.userRegistration.status === 'Absent'"
                        class="button-green rounded-full py-1 px-4 text-lg font-semibold"
                        @click="showRegistrationForm = true"
                    >
                        Me réinscrire à l'événement
                    </button>
                    <button
                        v-else
                        class="button-green rounded-full py-1 px-4 text-lg font-semibold"
                        @click="showRegistrationForm = true"
                    >
                        M'inscrire à l'événement
                    </button>
                </div>
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'

    import VueCountdown from '@chenfengyuan/vue-countdown'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import AvatarGroup from '@/components/List/AvatarGroup.vue'

    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'

    import TeamActivity from '@/components/App/General/TeamActivity.vue'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import FormPopUp from '@/components/Form/FormPopUp.vue'

    import { ref } from 'vue'
    import { useRoute } from 'vue-router'

    import { fullname } from '@/utils/users'
    import { getDateRangeString } from '@/utils/dateUtils'

    import { getEvent } from '@/graphql/queries/events/getEvent'
    import { registerEvent } from '@/graphql/queries/events/registerEvent'
    import { unregisterEvent } from '@/graphql/queries/events/unregisterEvent'

    import { useMutation } from '@vue/apollo-composable'
    import { showInfoToast, showSuccessToast, showToastGraphQLError } from '@/utils/toast'

    import {
        DEFAULT_EVENT_REGISTRATION_FORM_SCHEMA,
        EVENT_REGISTRATION_STATUS_FORM_SCHEMA,
    } from '@/shared/assets/form-schemas/default-schemas'

    const showRegistrationForm = ref(false)

    const { mutate: register, onDone: onDoneRegister, onError: onErrorRegister } = useMutation(registerEvent)
    onDoneRegister(() => {
        showSuccessToast("Vous vous êtes bien inscrit à l'événement 🎉")
        showRegistrationForm.value = false
    })
    onErrorRegister(showToastGraphQLError)

    const {
        mutate: unregister,
        onDone: onDoneUnregister,
        onError: onErrorUnregister,
    } = useMutation(unregisterEvent)
    onDoneUnregister(() => showInfoToast("Vous vous êtes désinscrit de l'événement"))
    onErrorUnregister(showToastGraphQLError)

    const route = useRoute()
    const isAdmin = ref(false)

    const timeUntil = (dateString) => new Date(dateString).getTime() - Date.now()
    const showAdmin = ref(false)

    const registrationShowLimit = 20
</script>
