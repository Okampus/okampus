<template>
    <div>
        <div v-if="events.length" class="centered-container text-0 mt-10 flex flex-col gap-4">
            <div class="mx-5 flex items-center -space-x-4">
                <SwiperButton type="prev" :swiper="[swiper, swiperSmall]" />
                <Swiper
                    :slides-per-view="1"
                    :space-between="5"
                    :centered-slides="true"
                    class="sm:hidden"
                    :loop="true"
                    @swiper="(s) => (swiperSmall = s)"
                >
                    <SwiperSlide v-for="event in events" :key="event" class="!h-auto">
                        <div class="h-full w-full p-2">
                            <ClubEventCard class="h-full" :event="event" />
                        </div>
                    </SwiperSlide>
                </Swiper>
                <Swiper
                    class="hidden sm:block"
                    :space-between="20"
                    :slides-per-view="3"
                    :loop="true"
                    :centered-slides="true"
                    @swiper="(s) => (swiper = s)"
                >
                    <SwiperSlide v-for="event in events" :key="event" class="!h-auto py-2">
                        <ClubEventCard class="h-full !w-full hover:transform-none" :event="event" />
                    </SwiperSlide>
                </Swiper>
                <SwiperButton type="next" :swiper="[swiper, swiperSmall]" />
            </div>
            <div class="mt-10 ml-10 text-3xl font-semibold">Tous les événements ({{ events.length }})</div>
            <div class="mx-14 mt-8 flex flex-wrap gap-4">
                <ClubEventCard v-for="event in events" :key="event" :event="event" />
            </div>
        </div>
        <div v-else>
            <div class="h-content text-0 my-auto -mt-10 flex flex-col items-center justify-center gap-6">
                <img class="h-48 w-48" :src="Calendar" />
                <div class="text-center">
                    <h1 class="text-4xl font-bold">Aucun événement</h1>
                    <p class="text-lg">Aucun événement n'a été prévu pour le moment.</p>
                </div>
            </div>
        </div>
        <!-- <div class="mx-16 mt-32">
            <EventCalendar :events="events" />
        </div> -->
    </div>
</template>

<script setup>
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'
    // import EventCalendar from '@/components/Event/EventCalendar.vue'
    import SwiperButton from '@/components/App/Swiper/SwiperButton.vue'

    import Calendar from '@/assets/img/3dicons/calendar.png'

    import { Swiper, SwiperSlide } from 'swiper/vue'

    import { useClubsStore } from '@/store/clubs.store'
    import { ref } from 'vue'

    const swiperSmall = ref(null)
    const swiper = ref(null)
    const clubs = useClubsStore()
    const events = ref([])

    const loadEvents = async () => {
        await clubs
            .getEvents({ itemsPerPage: 100 })
            .then((teamEvents) => {
                events.value = teamEvents
            })
            .catch((err) => console.error(err))
    }

    await loadEvents()
</script>
