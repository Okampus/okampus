<template>
    <div class="flex flex-col gap-10">
        <div class="relative">
            <ProfileBanner
                class="h-60"
                :name="event.shortDescription"
                :data="event.team.name"
                :rounded-top="false"
            />
            <div
                v-if="timeUntil > 0"
                class="flex absolute inset-0 flex-col gap-4 justify-center items-center m-auto text-center text-white"
            >
                <vue-countdown v-slot="{ days, hours, minutes, seconds }" tag="div" :time="timeUntil">
                    <div class="flex gap-2 items-center">
                        <div v-if="days" class="flex flex-col w-14">
                            <div>Jour{{ days ? 's' : '' }}</div>
                            <div class="text-2xl">
                                {{ days.toString().padStart(2, '0') }}
                            </div>
                        </div>
                        <div v-if="days" class="mt-4 text-xl font-semibold">:</div>
                        <div v-if="hours" class="flex flex-col w-20">
                            <div>Heures</div>
                            <div class="text-2xl">
                                {{ hours.toString().padStart(2, '0') }}
                            </div>
                        </div>
                        <div v-if="hours" class="mt-4 text-xl font-semibold">:</div>
                        <div v-if="minutes" class="flex flex-col w-20">
                            <div>Minutes</div>
                            <div class="text-2xl">
                                {{ minutes.toString().padStart(2, '0') }}
                            </div>
                        </div>
                        <div v-if="minutes" class="mt-4 text-xl font-semibold">:</div>
                        <div class="flex flex-col w-20">
                            <div class="tracking-tighter">Secondes</div>
                            <div class="text-2xl">
                                {{ seconds.toString().padStart(2, '0') }}
                            </div>
                        </div>
                    </div>
                </vue-countdown>
                <div class="text-lg">Restant{{ days === 0 ? 'e' : '' }}s avant le début de l'événement</div>
            </div>
        </div>

        <div class="flex flex-col gap-8 px-6 card-2 centered-container">
            <div class="flex justify-between">
                <div clas="flex flex-col gap-1">
                    <div class="text-3xl font-bold">{{ event.shortDescription }}</div>
                    <div class="flex gap-3 items-center py-2">
                        <router-link :to="`/club/${event.team.teamId}`">
                            <ProfileAvatar :name="event.team.name" :avatar="event.team.avatar" :size="1.8" />
                        </router-link>
                        <div class="flex gap-1 items-center">
                            <div class="text-sm">Organisé par</div>
                            <router-link
                                :to="`/club/${event.team.teamId}`"
                                class="text-lg font-semibold hover:underline text-0"
                                >{{ event.team.name }}</router-link
                            >
                            <div>•</div>
                            <div class="text-sm">Ajouté</div>
                            <TipRelativeDate class="text-sm" :date="event.createdAt" />
                        </div>
                    </div>
                </div>
                <div class="flex gap-4 items-center">
                    <div class="flex flex-col gap-2.5 items-center py-2 w-24 h-20">
                        <i class="mt-1 fa-solid fa-money-bill-1-wave" />
                        <div class="text-xl font-semibold">
                            {{ event.price === 0 ? 'Gratuit' : `${event.price} €` }}
                        </div>
                    </div>

                    <div
                        class="flex flex-col gap-1.5 items-center py-2 w-24 h-20 text-white bg-blue-500 rounded-lg"
                    >
                        <div class="text-lg font-bold">{{ startDay ?? 1 }}</div>
                        <div class="text-lg uppercase">{{ startMonth ?? 'Jan' }}</div>
                    </div>
                </div>
            </div>

            <div class="flex justify-between">
                <div class="flex flex-col gap-1 ml-1">
                    <div class="flex gap-4 items-center">
                        <i class="w-5 text-xl opacity-80 text-2 text-0 fa fa-calendar" />
                        <div>{{ dateRangeString }}</div>
                    </div>
                    <div class="flex gap-4 items-center">
                        <i class="w-5 text-xl opacity-80 text-2 text-0 fa fa-location-dot" />
                        <div>{{ event.place }}</div>
                    </div>
                </div>
                <div class="flex flex-col justify-center">
                    <button
                        v-if="guests.items.find((g) => g.user.userId === auth.user.userId) === undefined"
                        class="py-2 px-8 mb-1 w-fit text-lg font-bold text-white bg-green-500 rounded-full"
                        @click="showJoinForm = true"
                    >
                        S'inscrire
                    </button>
                    <button
                        v-else
                        class="py-2 px-8 mb-1 w-fit text-lg font-bold text-white bg-red-500 rounded-full"
                        @click="
                            () =>
                                unregister(
                                    guests.items.find((g) => g.user.userId === auth.user.userId)
                                        .teamEventRegistrationId,
                                )
                        "
                    >
                        Se désinscrire
                    </button>
                    <button
                        v-if="isAdmin"
                        class="py-2 px-8 mb-4 ml-auto w-fit text-lg font-bold text-white bg-blue-500 rounded-full"
                        @click="showAdmin = true"
                    >
                        Gérer
                    </button>
                </div>
            </div>

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
            </div>

            <div class="flex flex-col gap-4">
                <div class="text-2xl font-semibold text-0">Description</div>
                <div>{{ event.longDescription }}</div>
            </div>

            <div class="flex flex-col gap-4">
                <div class="text-2xl font-semibold text-0">Inscrits</div>
                <div v-if="guests.totalItemCount > 0" class="flex items-center">
                    <div v-for="guest in guests.items" :key="guest" class="-mr-6">
                        <ProfileAvatar :avatar="guest.user.avatar" :name="fullname(guest.user)" />
                    </div>
                    <div v-if="guests.totalItemCount > guests.itemsPerPage" class="ml-7 text-lg">
                        +{{ guests.totalItemCount - guests.itemsPerPage }}
                    </div>
                </div>
                <div v-else class="italic text-">Il n'y a personne d'inscrit pour l'instant.</div>
            </div>
        </div>

        <ModalPopup :show="showJoinForm" @close="showJoinForm = false">
            <template #default="{ close }">
                <div class="flex flex-col justify-center items-center py-8 px-10 card">
                    <div class="text-2xl font-semibold">
                        Vous vous apprêtez à vous inscrire à {{ event.shortDescription }}
                    </div>
                    <div class="text-sm text-2">
                        Mais d'abord, donnez du contexte sur votre demande de participation.
                    </div>
                    <FormKit
                        id="join-club"
                        ref="joinForm"
                        type="form"
                        form-class="flex flex-col mt-6 max-w-lg"
                        :actions="false"
                    >
                        <FormKit
                            type="text"
                            name="reason"
                            label="La raison de votre participation"
                            help="Décrivez en quelques mots la raison de votre participation."
                        />
                    </FormKit>
                    <div class="flex gap-4 self-end mt-6">
                        <button class="button-grey" @click="close">Annuler</button>
                        <button class="button-blue" @click="joinEvent">Valider</button>
                    </div>
                </div>
            </template>
        </ModalPopup>
        <ModalPopup :show="showAdmin" @close="showAdmin = false">
            <template #default="{ close }">
                <div class="flex flex-col justify-center items-center py-8 px-10 w-[48rem] card">
                    <div class="text-2xl font-semibold">
                        Voici l'onglet de gestion de
                        <span class="font-bold">{{ event.shortDescription }}</span>
                    </div>
                    <div class="text-sm text-2">
                        Gérer la présence des membres, les diverses infos de l'évenement ...
                    </div>
                    <table v-if="guests.items.length > 0" class="flex flex-col gap-2 mt-8">
                        <thead class="flex gap-2 items-center">
                            <tr class="w-56">
                                Invité
                            </tr>
                            <tr class="w-30">
                                Présence
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="guest in guests.items"
                                :key="guest.teamEventRegistrationId"
                                class="flex gap-2 items-center h-8 even:border-y-2 border-grey-600"
                            >
                                <td class="flex gap-2 items-center w-56 truncate">
                                    <ProfileAvatar
                                        :avatar="guest.user.avatar"
                                        :name="fullname(guest.user)"
                                        size="2"
                                    />
                                    <p>{{ fullname(guest.user) }}</p>
                                </td>
                                <td class="w-30">
                                    <SelectInput :choices="['Présent', 'Absent']"></SelectInput>
                                </td>
                                <td>
                                    <button
                                        class="py-1 px-2 text-white bg-red-500 rounded-md text-md"
                                        @click="() => unregister(guest.teamEventRegistrationId)"
                                    >
                                        Désinscrire
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-else class="mt-4">Personne n'est encore inscrit à l'évenement</p>

                    <div class="flex gap-4 self-end mt-6">
                        <div class="button-cancel" @click="close">Fermer</div>
                    </div>
                </div>
            </template>
        </ModalPopup>
    </div>
</template>

<script setup>
    import VueCountdown from '@chenfengyuan/vue-countdown'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import SelectInput from '@/components/Input/SelectInput.vue'

    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'

    import { computed, nextTick, ref, watchEffect } from 'vue'
    import { useRoute } from 'vue-router'

    import { useClubsStore } from '@/store/clubs.store'
    import { useAuthStore } from '@/store/auth.store'

    import { emitter } from '@/shared/modules/emitter'
    import { errorCodes } from '@/shared/errors/app-exceptions.enum'

    import { getStatusAxiosError } from '@/utils/errors'
    import { isPositiveInteger } from '@/utils/stringUtils'

    import { specialRoles } from '@/shared/types/club-roles.enum'

    import { fullname } from '@/utils/users'

    const route = useRoute()

    const clubs = useClubsStore()
    const auth = useAuthStore()
    const isAdmin = ref(false)

    const event = ref(null)

    const format = new Intl.DateTimeFormat('fr', {
        month: 'short',
    })

    const startDate = ref(null)
    const endDate = ref(null)

    const startMonth = ref('')
    const startDay = ref('')
    const endMonth = ref('')

    const now = new Date()
    const timeUntil = computed(() => (startDate.value ? startDate.value.getTime() - now.getTime() : 0))

    const dateRangeString = computed(
        () =>
            `${startDate.value.getDate()} ${startMonth.value} ${startDate.value.getHours()}h${
                startDate.value.getMinutes() ? startDate.value.getMinutes().toString().padStart(2, '0') : ''
            } - ${endDate.value.getDate()} ${endMonth.value} ${endDate.value.getHours()}h${
                endDate.value.getMinutes() ? endDate.value.getMinutes().toString().padStart(2, '0') : ''
            }`,
    )

    const guests = ref([])
    const showJoinForm = ref(false)
    const showAdmin = ref(false)

    const eventId = ref(route.params.eventId)

    const loadEvent = async () => {
        if (!isPositiveInteger(eventId.value)) {
            emitter.emit('error-route', errorCodes.NOT_FOUND)
            return
        }
        await clubs
            .getEvent(eventId.value)
            .then((res) => {
                event.value = res

                startDate.value = new Date(event.value.start)
                startDay.value = startDate.value.getDate()
                endDate.value = new Date(event.value.end)

                startMonth.value = format.format(startDate.value)
                endMonth.value = format.format(endDate.value)

                nextTick(() => {
                    if (route.hash) {
                        emitter.emit('scroll-to-anchor', route.hash)
                    }
                })
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatusAxiosError(err) })
            })
    }

    const loadGuests = async () => {
        await clubs
            .getEventGuests(eventId.value)
            .then((res) => {
                guests.value = res
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatusAxiosError(err) })
            })
    }

    const unregister = async (teamEventRegistrationId) => {
        await clubs
            .unregisterEvent(teamEventRegistrationId)
            .then(() => {
                emitter.emit('show-toast', {
                    message: 'Membre désinscrit avec succès !',
                    type: 'success',
                })
                loadEvent()
                loadGuests()
            })
            .catch((err) => {
                emitter.emit('show-toast', {
                    message: `Erreur : ${err.message}`,
                    type: 'failure',
                })
            })
    }

    const joinEvent = async () => {
        await clubs
            .joinEvent(eventId.value)
            .then(async () => {
                emitter.emit('show-toast', {
                    message: 'Votre inscription a bien été prise en compte',
                    type: 'success',
                })
                await loadGuests()
                showJoinForm.value = false
            })
            .catch((err) =>
                emitter.emit('show-toast', {
                    message: `Erreur : ${err.message}`,
                    type: 'failure',
                }),
            )
    }

    const loadClubs = async () => {
        await clubs.getMembershipsOf(auth.user).then((res) => {
            console.log({ res })
            res.filter((m) => m.team.teamId === event.value.team.teamId).forEach((m) => {
                if (specialRoles.includes(m.role)) {
                    isAdmin.value = true
                }
            })
        })
    }

    await loadEvent()
    await loadGuests()
    await loadClubs()

    watchEffect(async () => {
        eventId.value = route.params.eventId
        if (route.name === 'event' && isPositiveInteger(eventId.value)) {
            await loadEvent()
            await loadGuests()
            await loadClubs()
        }
    })
</script>
