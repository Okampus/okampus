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
            <div class="flex gap-2 w-full">
                <div class="w-full">
                    <FormKit
                        v-model="eventDate"
                        type="date"
                        name="eventDate"
                        label="Date"
                        class="w-full"
                        :value="eventDate"
                    />
                </div>
                <div class="w-full">
                    <FormKit
                        v-model="eventTime"
                        type="time"
                        name="eventHour"
                        label="Heure"
                        :value="eventTime"
                    />
                </div>
                <div class="w-full">
                    <FormKit
                        v-model="eventDuration"
                        type="number"
                        name="eventDuration"
                        label="Durée"
                        :value="eventDuration"
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
            <FormKit type="submit" label="Créer l'évenement" />
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

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const eventTitle = ref('')
    const eventDate = ref(null)
    const eventTime = ref(null)
    const eventDuration = ref(1)
    const eventLocation = ref('')
    const eventType = ref('Public')
    const events = ref([])
    const clubs = useClubsStore()

    const loadEvents = () => {
        clubs
            .getTeamEvents(props.club.teamId)
            .then((res) => {
                events.value = res.items
            })
            .catch((err) => {
                console.log(err)
            })
    }

    await loadEvents()
</script>
