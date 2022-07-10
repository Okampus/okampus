<template>
    <div v-if="events.length" class="mt-10 centered-container text-0">
        <div class="flex items-center mx-5 -space-x-4">
            <button class="button-prev button-blue" @click="() => swiper?.slidePrev?.(200)">
                <i class="fas fa-angle-left" />
            </button>
            <Swiper
                slides-per-view="auto"
                :space-between="20"
                :loop="true"
                :centered-slides="true"
                @swiper="(s) => (swiper = s)"
            >
                <SwiperSlide v-for="event in events" :key="event" class="py-2 max-w-[20rem] !h-auto">
                    <ClubEventCard class="!w-full h-full" :event="event" />
                </SwiperSlide>
            </Swiper>
            <button class="button-next button-blue" @click="swiper?.slideNext?.(200)">
                <i class="fas fa-angle-right" />
            </button>
        </div>

        <h1 class="mt-16 text-3xl font-bold">Liste des événements</h1>
        <div class="flex flex-wrap gap-4 mx-14 mt-8">
            <ClubEventCard v-for="event in events" :key="event" :event="event" />
        </div>
    </div>
    <div v-else>
        <div class="flex flex-col gap-6 justify-center items-center my-auto -mt-10 h-content text-0">
            <img class="w-48 h-48" :src="Calendar" />
            <div class="text-center">
                <h1 class="text-4xl font-bold">Aucun événement</h1>
                <p class="text-lg">Aucun événement n'a été prévu pour le moment.</p>
            </div>
        </div>
    </div>
    <div class="mx-16 mt-32">
        <EventsCalendar :events="events"></EventsCalendar>
    </div>
</template>

<script setup>
    import Calendar from '@/assets/img/3dicons/calendar.png'

    import { Swiper, SwiperSlide } from 'swiper/vue'

    import { useClubsStore } from '@/store/clubs.store'
    import { ref } from 'vue'
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'
    import EventsCalendar from '@/components/Events/EventsCalendar.vue'

    const swiper = ref(null)
    const clubs = useClubsStore()
    const events = ref([])

    const loadEvents = async () => {
        await clubs
            .getEvents({ itemsPerPage: 100 })
            .then((teamEvents) => {
                events.value = teamEvents
                console.log('events', events.value, teamEvents)
            })
            .catch((err) => console.error(err))
    }

    await loadEvents()
</script>

<style lang="scss">
    .button-prev,
    .button-next {
        @apply rounded-full w-12 h-12 text-2xl shrink-0 flex items-center justify-center z-50;
    }
</style>
