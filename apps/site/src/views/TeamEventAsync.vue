<template>
    <div class="flex flex-col items-center pt-4 w-full h-full min-h-screen text-0">
        <div class="w-[36em] rounded-md shadow-md bg-2">
            <div class="w-full h-32 bg-red-500 rounded-t-md"></div>
            <div class="p-4">
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
                        <div class="flex flex-col items-center p-2 bg-blue-500 rounded-md">
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
                        class="py-2 px-8 w-fit text-lg font-bold text-white bg-green-500 rounded-full"
                        @click="joinEvent"
                    >
                        S'inscrire
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { errorCodes } from '@/shared/errors/app-exceptions.enum'
    import { emitter } from '@/shared/modules/emitter'
    import { useClubsStore } from '@/store/clubs.store'
    import { getStatusAxiosError } from '@/utils/errors'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import { isPositiveInteger } from '@/utils/stringUtils'
    import { nextTick, ref } from 'vue'
    import { useRoute } from 'vue-router'

    const route = useRoute()
    const clubs = useClubsStore()
    const event = ref(null)
    const guests = ref([])

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

    const joinEvent = async () => {
        const eventId = route.params.eventId
        await clubs
            .joinEvent(eventId)
            .then(
                () =>
                    emitter.emit('show-toast', {
                        message: 'Votre inscription a bien été prise en compte',
                        type: 'success',
                    }),
                loadGuests(),
            )
            .catch(
                emitter.emit('show-toast', {
                    message: "Erreur lors de l'opération",
                    type: 'failure',
                }),
            )
    }

    const load = async () => {
        await loadEvent()
        await loadGuests()
    }

    await load()
</script>
