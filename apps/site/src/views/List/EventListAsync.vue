<template>
    <div>
        <div v-if="events.length" class="flex flex-col gap-4 mt-10 centered-container text-0">
            <div class="flex items-center mx-5 -space-x-4">
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
                        <div class="p-2 w-full h-full">
                            <ClubEventCard class="h-full" :event="event" />
                        </div>
                    </SwiperSlide>
                </Swiper>
                <Swiper
                    class="hidden sm:block"
                    effect="coverflow"
                    :slides-per-view="3"
                    :loop="true"
                    :coverflow-effect="{
                        rotate: 40,
                        stretch: 0,
                        depth: 100,
                        modifier: 1.2,
                        slideShadows: true,
                    }"
                    :centered-slides="true"
                    @swiper="(s) => (swiper = s)"
                >
                    <SwiperSlide v-for="event in events" :key="event" class="py-2 !h-auto">
                        <ClubEventCard class="!w-full h-full hover:transform-none" :event="event" />
                    </SwiperSlide>
                </Swiper>
                <SwiperButton type="next" :swiper="[swiper, swiperSmall]" />
            </div>
            <div class="mt-10 ml-10 text-3xl font-semibold">Tous les événements ({{ events.length }})</div>
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
    </div>
</template>

<script setup>
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'
    import EventsCalendar from '@/components/Events/EventsCalendar.vue'
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
                console.log('events', events.value, teamEvents)
            })
            .catch((err) => console.error(err))
    }

    await loadEvents()
</script>
