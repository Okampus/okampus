<template>
    <div class="mb-32">
        <h1 class="text-3xl font-bold">Gérer les activités de votre association</h1>
        <div class="p-4 mx-auto mt-4 w-[36rem] rounded-lg shadow-md bg-2">
            <h2 class="pb-4 text-2xl border-b-2 border-gray-400">Créer un évenement</h2>
            <FormKit
                v-model="eventTitle"
                type="text"
                name="eventTitle"
                label="Titre de l'évenement"
                placeholder="Titre de l'évenement"
                :value="eventTitle"
            />
            <FormKit
                v-model="eventDescription"
                type="text"
                name="eventDescription"
                label="Description de l'évenement"
                placeholder="Description de l'évenement"
                :value="eventDescription"
            />
            <div class="flex gap-2 w-full">
                <div class="w-full">
                    <FormKit
                        v-model="eventDate"
                        type="date"
                        name="eventDate"
                        label="Date de début"
                        class="w-full"
                        :value="eventDate"
                    />
                </div>
                <div class="w-full">
                    <FormKit
                        v-model="eventTime"
                        type="time"
                        name="eventHour"
                        label="Heure de début"
                        :value="eventTime"
                    />
                </div>
            </div>
            <div class="flex">
                <div class="w-full">
                    <FormKit
                        v-model="eventDateEnd"
                        type="date"
                        name="eventDateEnd"
                        label="Date de fin"
                        class="w-full"
                        :value="eventDateEnd"
                    />
                </div>
                <div class="w-full">
                    <FormKit
                        v-model="eventTimeEnd"
                        type="time"
                        name="eventTimeEnd"
                        label="Heure de fin"
                        :value="eventTimeEnd"
                    />
                </div>
            </div>
            <FormKit
                v-model="eventLocation"
                type="text"
                name="eventLocation"
                label="Lieu"
                placeholder="Lieu"
                :value="eventLocation"
            />
            <FormKit
                v-model="eventType"
                type="radio"
                :options="['Public', 'Privé']"
                label="Type d'évenement"
                help="Choisir d'ouvrir l'évenement à tout le monde ou seulement aux membres de l'assocition"
                :value="eventType"
            />
            <button class="mt-4 button" @click="createEvent"><p>Créer l'évenement</p></button>
        </div>
        <div class="mt-4">
            <h2 class="mb-4 text-2xl">Evenements de votre association</h2>
            <div class="flex flex-row flex-wrap gap-4 justify-center items-center mt-8">
                <div v-for="event in events" :key="event">
                    <ClubEventCard :event="event"></ClubEventCard>
                </div>
            </div>
        </div>
        <div class="mt-4">
            <h2 class="mb-4 text-2xl">Evenements de votre association</h2>
            <div class="flex flex-col gap-8">
                <div v-for="event in events" :key="event">
                    <ClubEventCard :event="event"></ClubEventCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'
    import { useClubsStore } from '@/store/clubs.store'
    import { emitter } from '@/shared/modules/emitter'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const eventTitle = ref('')
    const eventDate = ref(null)
    const eventTime = ref(null)
    const eventDateEnd = ref(null)
    const eventTimeEnd = ref(null)
    const eventLocation = ref('')
    const eventType = ref('Public')
    const events = ref([])
    const clubs = useClubsStore()
    const eventDescription = ref('')

    const loadEvents = async () => {
        await clubs
            .getTeamEvents(props.club.teamId)
            .then((res) => {
                events.value = res.items
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const createEvent = async () => {
        const start = new Date(eventDate.value)
        start.setHours(eventTime.value.split(':')[0])
        start.setMinutes(eventTime.value.split(':')[1])
        const end = new Date(eventDateEnd.value)
        end.setHours(eventTimeEnd.value.split(':')[0])
        end.setMinutes(eventTimeEnd.value.split(':')[1])
        await clubs
            .createEvent(props.club.teamId, {
                shortDescription: eventTitle.value,
                longDescription: eventDescription.value,
                start: start,
                end: end,
                place: eventLocation.value,
                private: eventType.value === 'Privé',
                preconditions: 'aaaaaa',
            })
            .then(() => {
                emitter.emit('show-toast', {
                    message: "L'évenement a bien été crée",
                    type: 'success',
                })
                loadEvents()
            })
            .catch(() => {
                emitter.emit('show-toast', {
                    message: "erreur lors de la création de l'évenement",
                    type: 'error',
                })
            })
    }

    await loadEvents()
</script>
