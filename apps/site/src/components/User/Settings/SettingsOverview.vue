<template>
    <div class="flex flex-col gap-6 m-4 text-2">
        <div>
            <div class="text-lg text-0">Mes activités</div>

            <div v-if="events.length === 0">Vous n'êtes inscris à aucun événement</div>
            <div class="v-else">
                <div v-for="event in events" :key="event">
                    <ClubEventCard :event="event"></ClubEventCard>
                </div>
            </div>
        </div>
        <div>
            <div class="text-lg text-0">Mes inscriptions</div>
            <div>Vous n'êtes inscrit à aucun événement.</div>
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
    const me = ref(null)
    const events = ref([])
    me.value = auth.user

    const loadEvents = async () => {
        if (me.value) {
            const eventss = await clubs
                .getEvents()
                .then((res) => res.items)
                .catch((err) => {
                    emitter.emit('error-route', { code: getStatusAxiosError(err) })
                })
            eventss.forEach(async (event) => {
                console.log(event)
                await clubs.getEventGuests(event.teamEventId).then((guests) => {
                    if (guests.items.find((guest) => guest.user.userId === me.value.userId)) {
                        events.value.push(event)
                    }
                })
            })
        }
    }

    await loadEvents()
</script>
