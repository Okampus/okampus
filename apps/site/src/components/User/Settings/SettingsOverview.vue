<template>
    <div class="flex flex-col gap-6 m-4 text-2">
        <div class="text-lg text-0">Mes inscriptions</div>
        <div v-if="events.length === 0">Vous n'êtes inscrit à aucun événement.</div>
        <template v-else>
            <div v-for="event in events" :key="event">
                <ClubEventCard :event="event"></ClubEventCard>
            </div>
        </template>
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
                        if (guests.items.find((guest) => guest.user.userId === auth.user.userId)) {
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
