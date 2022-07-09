<template>
    <div v-if="events.length > 0" class="flex flex-row flex-wrap gap-4 justify-center items-center">
        <ClubEventCard v-for="event in events" :key="event" :event="event" />
    </div>
    <div v-else class="flex flex-col gap-4 items-center pt-8 text-0">
        <i class="text-6xl fas fa-calendar-day" />
        <div class="text-xl text-center">{{ club.name }} n'a pas encore prévu d'événéments.</div>
    </div>
    <div class="mt-8">
        <EventsCalendar :events="events"></EventsCalendar>
    </div>
</template>

<script setup>
    import ClubEventCard from '../../Club/ClubEventCard.vue'
    import EventsCalendar from '@/components/Events/EventsCalendar.vue'
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
