<template>
    <GraphQLQuery
        :query="getEvents"
        :variables="{ filter: { id: club.id } }"
        :update="(data) => data?.events"
    >
        <template #default="{ data: events }">
            <div v-if="events.length === 0" class="text-0 flex flex-col items-center gap-6 pt-8">
                <img class="h-48 w-48" :src="Calendar" />
                <div class="text-center">
                    <h1 class="text-4xl font-bold">Aucun événement</h1>
                    <p class="text-lg">{{ club.name }} n'a pas encore prévu d'événéments.</p>
                </div>
            </div>
            <div v-else class="grid grid-cols-[repeat(auto-fit,minmax(23rem,1fr))] gap-6">
                <ClubEventCard v-for="event in events" :key="event.id" :event="event" />
            </div>
            <!-- <div v-if="events.length > 0" class="flex flex-row flex-wrap items-center justify-center gap-4">
            <ClubEventCard v-for="event in events" :key="event" :event="event" />
        </div>
        <div v-else class="text-0 flex flex-col items-center gap-6 pt-8">
        </div> -->
            <!-- <div class="mt-8">
            <EventCalendar :events="events" />
        </div> -->
        </template>
        <template #empty>
            <div class="text-0 my-12 flex flex-col items-center gap-2">
                <img class="h-48 w-48" :src="Calendar" />
                <div class="text-center">
                    <h1 class="text-4xl font-bold">Aucun événement</h1>
                    <p class="text-lg">{{ club.name }} n'a pas encore prévu d'événéments.</p>
                </div>
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import Calendar from '@/assets/img/3dicons/calendar.png'

    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'
    // import EventCalendar from '@/components/Event/EventCalendar.vue'
    import { getEvents } from '@/graphql/queries/events/getEvents'

    defineProps({
        club: {
            type: Object,
            required: true,
        },
    })
</script>
