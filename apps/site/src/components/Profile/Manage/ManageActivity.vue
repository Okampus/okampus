<template>
    <div>
        <ModalPopup :show="showCreateForm" @close="showCreateForm = false">
            <template #default="{ close }">
                <div class="flex flex-col gap-4 justify-center items-center py-8 px-10 card">
                    <div class="w-full">
                        <div class="text-2xl font-semibold">Créer un événement</div>
                        <div class="text-sm text-2">
                            Mais d'abord, donnez du contexte sur votre demande de participation.
                        </div>
                    </div>

                    <FormKit
                        ref="createForm"
                        v-model="createEventData"
                        :actions="false"
                        type="form"
                        class="flex flex-col gap-4"
                        @submit="
                            (data) => {
                                createEvent(data)
                                close()
                            }
                        "
                    >
                        <div class="w-full">
                            <FormKit
                                name="eventTitle"
                                outer-class="w-full"
                                :validation="[['required'], ['length', 5]]"
                                type="text"
                                label="Titre de l'évenement"
                                placeholder="Titre de l'évenement"
                            />
                            <FormKit
                                name="eventDescription"
                                outer-class="w-full"
                                :validation="[['required'], ['length', 5]]"
                                type="text"
                                label="Description de l'évenement"
                                placeholder="Description de l'évenement"
                            />
                        </div>
                        <div class="w-full">
                            <div class="flex gap-2 w-full">
                                <FormKit
                                    name="eventDateStart"
                                    outer-class="w-full"
                                    :validation="[['required']]"
                                    type="date"
                                    label="Date de début"
                                />
                                <FormKit
                                    name="eventTimeStart"
                                    outer-class="w-full"
                                    :validation="[['required']]"
                                    type="time"
                                    label="Heure de début"
                                />
                            </div>
                            <div class="flex gap-2 w-full">
                                <FormKit
                                    name="eventDateEnd"
                                    outer-class="w-full"
                                    :validation="[['required']]"
                                    type="date"
                                    label="Date de fin"
                                />
                                <FormKit
                                    name="eventTimeEnd"
                                    :validation="[['required']]"
                                    outer-class="w-full"
                                    type="time"
                                    label="Heure de fin"
                                />
                            </div>
                        </div>
                        <FormKit
                            name="eventLocation"
                            :validation="[['required']]"
                            outer-class="w-full"
                            type="text"
                            label="Lieu"
                            placeholder="Lieu"
                        />
                        <FormKit
                            name="eventType"
                            :options="['Public', 'Privé']"
                            :validation="[['required']]"
                            type="radio"
                            label="Type d'évenement"
                            help="Choisir d'ouvrir l'évenement à tout le monde ou seulement aux membres de l'assocition"
                        />
                    </FormKit>

                    <div class="flex gap-4 self-end mt-6">
                        <div class="button-cancel" @click="close">Annuler</div>
                        <div class="button-submit with-shadow" @click="createForm.node.submit()">
                            Créer l'événement
                        </div>
                    </div>
                </div>
            </template>
        </ModalPopup>

        <div class="flex flex-col items-center mt-4">
            <button
                class="py-2 px-8 mb-4 w-fit text-lg font-bold text-white bg-green-500 rounded-full"
                @click="showCreateForm = true"
            >
                Créer un nouvel événement
            </button>

            <div
                v-if="events.length > 0"
                class="flex flex-row flex-wrap gap-4 justify-center items-center mt-8"
            >
                <ClubEventCard v-for="event in events" :key="event" :event="event" />
            </div>
            <div v-else>
                <i class="text-3xl fas fa-calendar-day" />
                <div class="text-lg font-semibold text-center">
                    Votre association n'a pas encore prévu d'événéments.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'

    import { ref } from 'vue'
    import { useClubsStore } from '@/store/clubs.store'
    import { emitter } from '@/shared/modules/emitter'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const createForm = ref(null)
    const showCreateForm = ref(false)
    const createEventData = ref({})

    const events = ref([])
    const clubs = useClubsStore()

    const loadEvents = async () => {
        await clubs
            .getTeamEvents(props.club.teamId)
            .then((teamEvents) => {
                events.value = teamEvents
            })
            .catch((err) => {
                console.log(err)
                emitter.emit('show-toast', {
                    message: `Erreur lors du chargement des événements: ${err.message}`,
                    type: 'error',
                })
            })
    }

    const createEvent = async (event) => {
        const start = new Date(event.eventDateStart)
        start.setHours(event.eventTimeStart.split(':')[0])
        start.setMinutes(event.eventTimeStart.split(':')[1])

        const end = new Date(event.eventDateEnd)
        end.setHours(event.eventTimeEnd.split(':')[0])
        end.setMinutes(event.eventTimeEnd.split(':')[1])

        await clubs
            .createEvent(props.club.teamId, {
                shortDescription: event.eventTitle,
                longDescription: event.eventDescription,
                start: start,
                end: end,
                place: event.eventLocation,
                private: event.eventType === 'Privé',
                preconditions: 'aaaaaa',
            })
            .then(() => {
                emitter.emit('show-toast', {
                    message: "L'évenement a bien été crée",
                    type: 'success',
                })
                loadEvents()
            })
            .catch((err) => {
                emitter.emit('show-toast', {
                    message: `Erreur lors de la création de l'évenement: ${err.message}`,
                    type: 'error',
                })
            })
    }

    await loadEvents()
</script>
