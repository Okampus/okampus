<template>
    <ProfileBanner
        class="p-0 mt-8 h-32 centered-container"
        :name="event.shortDescription"
        :data="event.team.name"
    ></ProfileBanner>
    <div class="rounded-b-md shadow-md text-0 centered-container bg-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold">{{ event.shortDescription }}</h1>
                <p>{{ event.longDescription }}</p>
            </div>
            <div class="flex">
                <div class="flex gap-2 justify-center items-center mr-4">
                    <i class="fas fa-money-bill"></i>
                    <div>{{ event.price }}</div>
                </div>
                <div class="flex flex-col items-center p-2 text-black bg-blue-500 rounded-md">
                    <i class="text-md fas fa-calendar"></i>
                    <div class="text-sm">
                        {{ new Date(event.start).toLocaleString().substr(0, 10) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex gap-2 items-center pb-4 mt-2">
            <ProfileAvatar :avatar="event.team.avatar" size="2" :name="event.team.name" />
            <p class="text-sm text-2">
                Organisé par <span class="font-bold text-0">{{ event.team.name }}</span>
            </p>
        </div>
        <h2 class="text-xl font-bold">Informations</h2>
        <div class="flex flex-col gap-2">
            <div class="py-1 px-4 rounded-md bg-1">
                <div class="flex gap-2 items-center">
                    <i class="text-lg fas fa-calendar"></i>
                    <div class="text-md">
                        Du
                        <span class="font-bold">
                            {{
                                new Date(event.start).toLocaleDateString() +
                                ' ' +
                                new Date(event.start).toISOString().substr(11, 5)
                            }}
                        </span>
                        au
                        <span class="font-bold"
                            >{{
                                new Date(event.end).toLocaleDateString() +
                                ' ' +
                                new Date(event.end).toISOString().substr(11, 5)
                            }}
                        </span>
                    </div>
                </div>
                <div class="flex gap-2 items-center">
                    <i class="text-lg fas fa-location-dot"></i>
                    <div class="text-md">
                        {{ event.place }}
                    </div>
                </div>
            </div>
            <p>Requis : {{ event.preconditions }}</p>
        </div>
        <h2 class="text-xl font-bold">Invités</h2>
        <div v-if="guests.totalItemCount > 0" class="flex items-center">
            <div v-for="guest in guests.items" :key="guest" class="-mr-6">
                <ProfileAvatar
                    :avatar="guest.user.avatar"
                    :name="guest.user.firstname + ' ' + guest.user.lastname"
                />
            </div>
            <div v-if="guests.totalItemCount > guests.itemsPerPage" class="ml-7 text-lg">
                +{{ guests.totalItemCount - guests.itemsPerPage }}
            </div>
        </div>
        <div v-else class="text-sm">Il n'y a personne d'inscrit pour l'instant</div>
        <div class="flex justify-center mt-4 w-full">
            <button
                v-if="guests.items.find((g) => g.user.userId === me.userId) === undefined"
                class="py-2 px-8 mb-4 w-fit text-lg font-bold text-white bg-green-500 rounded-full"
                @click="showJoinForm = true"
            >
                S'inscrire
            </button>
            <button
                v-else
                class="py-2 px-8 mb-4 w-fit text-lg font-bold text-white bg-red-500 rounded-full"
                @click="unJoin"
            >
                Se desinscrire
            </button>
        </div>
    </div>
    <ModalPopup :show="showJoinForm" @close="showJoinForm = false">
        <template #default="{ close }">
            <div class="flex flex-col justify-center items-center py-8 px-10 card">
                <div class="text-2xl font-semibold">
                    Vous vous apprêtez à vous inscrire à {{ event.shortDescription }} !
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
                    <div class="button-cancel" @click="close">Annuler</div>
                    <div class="button-submit with-shadow" @click="joinEvent">Valider</div>
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup>
    import { errorCodes } from '@/shared/errors/app-exceptions.enum'
    import { emitter } from '@/shared/modules/emitter'
    import { useClubsStore } from '@/store/clubs.store'
    import { getStatusAxiosError } from '@/utils/errors'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import { isPositiveInteger } from '@/utils/stringUtils'
    import { nextTick, ref, watchEffect } from 'vue'
    import { useRoute } from 'vue-router'
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import { useAuthStore } from '@/store/auth.store'

    const route = useRoute()
    const clubs = useClubsStore()
    const auth = useAuthStore()
    const event = ref(null)
    const me = ref(null)
    me.value = auth.user
    const guests = ref([])
    const showJoinForm = ref(false)

    const loadEvent = async () => {
        if (route.name === 'event') {
            const eventId = route.params.eventId
            if (!isPositiveInteger(eventId)) {
                emitter.emit('error-route', errorCodes.NOT_FOUND)
                return
            }
            await clubs
                .getEvent(eventId)
                .then((res) => {
                    event.value = res
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
    }

    const loadGuests = async () => {
        if (route.name === 'event') {
            const eventId = route.params.eventId
            if (!isPositiveInteger(eventId)) {
                emitter.emit('error-route', errorCodes.NOT_FOUND)
                return
            }
            await clubs
                .getEventGuests(eventId)
                .then((res) => {
                    guests.value = res
                })
                .catch((err) => {
                    emitter.emit('error-route', { code: getStatusAxiosError(err) })
                })
        }
    }

    const unJoin = async () => {
        if (route.name === 'event') {
            const eventId = route.params.eventId
            if (!isPositiveInteger(eventId)) {
                emitter.emit('error-route', errorCodes.NOT_FOUND)
                return
            }
            await clubs
                .unRegisterEvent(eventId)
                .then(() => {
                    emitter.emit('show-toast', {
                        message: 'Vous vous êtes désinscrit avec succès !',
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
    }

    const joinEvent = async () => {
        const eventId = route.params.eventId
        await clubs
            .joinEvent(eventId)
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

    const load = async () => {
        await loadEvent()
        await loadGuests()
    }

    await load()

    watchEffect(async () => {
        const eventId = route.params.eventId
        if (isPositiveInteger(eventId)) {
            await load()
        }
    })
</script>
