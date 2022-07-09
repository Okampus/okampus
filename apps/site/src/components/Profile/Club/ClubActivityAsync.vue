<template>
    <div v-if="events.length > 0" class="flex flex-row flex-wrap gap-4 justify-center items-center">
        <ClubEventCard v-for="event in events" :key="event" :event="event" />
    </div>
    <div v-else class="flex flex-col gap-6 items-center pt-8 text-0">
        <img class="w-48 h-48" :src="Calendar" />

        <div class="text-center">
            <h1 class="text-4xl font-bold">Aucun événement</h1>
            <p class="text-lg">{{ club.name }} n'a pas encore prévu d'événéments.</p>
        </div>
    </div>
</template>

<script setup>
    import ClubEventCard from '../../Club/ClubEventCard.vue'
    import Calendar from '@/assets/img/3dicons/calendar.png'

    import { ref, watch } from 'vue'
    import { useClubsStore } from '@/store/clubs.store'
    import { emitter } from '@/shared/modules/emitter'

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const clubs = useClubsStore()
    const events = ref([])

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

    await loadEvents()
    watch(() => props.club.teamId, loadEvents)
</script>
