<template>
    <div class="flex flex-col gap-6 card">
        <div class="text-lg font-semibold text-0">Mes inscriptions</div>

        <div class="flex flex-wrap gap-6 w-full text-2">
            <div v-if="events.length === 0">Vous n'êtes inscrit à aucun événement.</div>
            <template v-else>
                <ClubEventCard v-for="event in events" :key="event.eventId" :event="event" />
            </template>
        </div>
    </div>
</template>

<script setup>
    import { emitter } from '@/shared/modules/emitter'
    import { useAuthStore } from '@/store/auth.store'
    import { useClubsStore } from '@/store/clubs.store'
    import { getStatusAxiosError } from '@/utils/errors'
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'
    import { ref } from 'vue'

    const auth = useAuthStore()
    const clubs = useClubsStore()
    const events = ref([])

    const loadEvents = async () => {
        await clubs
            .getEvents()
            .then((teamEvents) => {
                teamEvents.forEach(async (event) => {
                    await clubs.getEventGuests(event.teamEventId).then((guests) => {
                        if (guests.items.find((guest) => guest.user.id === auth.user.id)) {
                            events.value.push(event)
                        }
                    })
                })
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatusAxiosError(err) })
            })
    }

    await loadEvents()
</script>
