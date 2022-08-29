<template>
    <GraphQLQuery
        :query="getEvents"
        :variables="{ filter: { state: PUBLISHED } }"
        :update="(date) => date?.events"
        :whole-page="true"
    >
        <template #default="{ data: events }">
            <div class="centered-container text-0 mt-10 flex flex-col gap-6">
                <div v-if="events.length > 3" class="mx-5 mb-10 flex items-center -space-x-4">
                    <SwiperButton type="prev" :swiper="swiper" />
                    <Swiper
                        :space-between="sm ? 12 : 0"
                        :slides-per-view="xl ? 3 : sm ? 2 : 1"
                        :loop="true"
                        @swiper="(s) => (swiper = s)"
                    >
                        <SwiperSlide v-for="event in events" :key="event" class="!h-auto py-2">
                            <ClubEventCard class="h-full !w-full hover:transform-none" :event="event" />
                        </SwiperSlide>
                    </Swiper>
                    <SwiperButton type="next" :swiper="swiper" />
                </div>
                <div class="ml-10 text-3xl font-semibold">Tous les événements ({{ events.length }})</div>
                <div class="mx-12 grid h-fit grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
                    <ClubEventCard v-for="event in events" :key="event" :event="event" />
                </div>
            </div>
        </template>
        <template #empty>
            <div class="text-0 -mt-6 flex h-full flex-col items-center justify-center gap-4">
                <img class="h-48 w-48" :src="Calendar" />
                <div class="text-center">
                    <p class="text-4xl font-bold">Aucun événement</p>
                    <p class="text-2 text-lg">Aucun événement n'a été prévu pour le moment.</p>
                </div>
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'
    // import EventCalendar from '@/components/Event/EventCalendar.vue'
    import SwiperButton from '@/components/App/Swiper/SwiperButton.vue'

    import Calendar from '@/assets/img/3dicons/calendar.png'

    import { Swiper, SwiperSlide } from 'swiper/vue'

    import { ref } from 'vue'

    import { getEvents } from '@/graphql/queries/events/getEvents'

    import { useBreakpoints } from '@vueuse/core'
    import { twBreakpoints } from '@/tailwind'

    import { PUBLISHED } from '@/shared/types/event-states.enum'

    const breakpoints = useBreakpoints(twBreakpoints)
    const sm = breakpoints.greater('ssm')
    const xl = breakpoints.greater('xl')

    const swiper = ref(null)
</script>
