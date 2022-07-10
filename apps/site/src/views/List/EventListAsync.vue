<template>
    <div v-if="events.length" class="mt-10 centered-container text-0">
        <Carousel class="mx-6 w-[calc(100%-4rem)]" :settings="settings" :breakpoints="breakpoints">
            <Slide v-for="event in events" :key="event">
                <ClubEventCard :event="event" />
            </Slide>

            <template #addons>
                <Navigation />
            </template>
        </Carousel>

        <h1 class="mt-16 text-3xl font-bold">Liste des événements</h1>
        <div class="flex flex-row flex-wrap gap-4 items-center mx-14 mt-8">
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
    import 'vue3-carousel/dist/carousel.css'
    import { Carousel, Slide, Navigation } from 'vue3-carousel'

    import { useClubsStore } from '@/store/clubs.store'
    import { ref } from 'vue'
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'
    import EventsCalendar from '@/components/Events/EventsCalendar.vue'

    const breakpoints = {
        // 700px and up
        500: {
            itemsToShow: 1.5,
        },
        700: {
            itemsToShow: 2,
        },
        900: {
            itemsToShow: 2.5,
        },
        // 1024 and up
        1280: {
            itemsToShow: 3,
        },
    }

    const settings = {
        autoplay: 5000,
        wrapAround: true,
        itemsToShow: 1,
        snapAlign: 'center',
    }

    const clubs = useClubsStore()
    const events = ref([])

    // const scrollLeft = () => {
    //     carousselContainer.value.scrollLeft -= 200
    // }
    // const scrollRight = () => {
    //     carousselContainer.value.scrollLeft += 200
    // }

    const loadEvents = async () => {
        await clubs
            .getEvents()
            .then((teamEvents) => {
                events.value = teamEvents
                console.log('events', events.value, teamEvents)
            })
            .catch((err) => console.error(err))
    }

    await loadEvents()
</script>

<style lang="scss">
    /* stylelint-disable selector-class-pattern */
    .carousel__prev,
    .carousel__next {
        box-sizing: content-box;
        border: 5px solid white;

        .dark & {
            border: 5px solid #000;
        }
    }
</style>
