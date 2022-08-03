<template>
    <vue-cal
        class="h-screen"
        :disable-views="['years', 'year']"
        :events="
            props.events.map((e) => ({
                start: new Date(e.start),
                end: new Date(e.end),
                title: e.shortDescription,
                event: e,
                backgroung: false,
            }))
        "
        locale="fr"
    >
        <template #events-count="{ events: eventsList, view }">
            <div v-if="view.id === 'month'" class="flex gap-2">
                <div v-for="(event, idx) in eventsList" :key="idx" class="">
                    <div class="">
                        <ProfileAvatar
                            :avatar="event.event.team.avatar"
                            :name="event.event.team.name"
                            :size="1"
                        />
                    </div>
                </div>
            </div>
        </template>
        <!-- <template #event="{ event, view }">
            <div v-if="view" class="m-0 w-full p-4">
                < :prevent-overflow="false" :interactive="true">
                    <div
                        class="absolute inset-0 m-0 mr-3 h-full self-stretch rounded-r-md rounded-l-sm border-l-4 border-yellow-400 p-1 text-sm leading-tight text-white hover:scale-[1.01] hover:shadow-xl focus:scale-[1.01] focus:shadow-xl"
                        :style="{ 'background-color': getColorFromData(event.event.team.category) }"
                    >
                        <div class="flex items-center gap-2">
                            <ProfileAvatar
                                :size="2"
                                :avatar="event.event.team.avatar"
                                :name="event.event.team.name"
                            />
                            <p class="truncate">{{ event.title }}</p>
                        </div>
                    </div>
                    <template #content>
                        <div class="bg-2 z-50 flex w-96 flex-col gap-4 rounded-md p-6">
                            <div class="flex items-center">
                                <i
                                    class="fas fa-circle mr-4 h-4 w-4"
                                    :style="{
                                        color: getColorFromData(event.event.team.category),
                                    }"
                                ></i>
                                <div class="text-left">
                                    <h2 class="text-xl">
                                        {{ event.event.shortDescription }}
                                    </h2>
                                    <p class="text-sm text-gray-500">
                                        {{ formatHour(event.start) }}
                                        à
                                        {{ formatHour(event.end) }}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-location-dot mr-4 h-4 w-4 text-gray-500"> </i>
                                <p class="">{{ event.event.place }}</p>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-euro-sign mr-4 h-4 w-4 text-gray-500"> </i>
                                <p class="">
                                    {{ event.event.price > 0 ? event.event.price : 'Gratuit' }}
                                </p>
                            </div>
                            <p>
                                <router-link
                                    :to="`/event/${event.event.id}`"
                                    class="w-fit rounded-full bg-green-500 py-1 px-4 text-center text-sm font-bold text-white"
                                    >En savoir plus</router-link
                                >
                            </p>
                        </div>
                    </template>
                </>
            </div>
        </template> -->
    </vue-cal>
</template>

<script setup>
    import VueCal from 'vue-cal'
    import 'vue-cal/dist/vuecal.css'
    import 'vue-cal/dist/i18n/fr.js'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    // import { getColorFromData } from '@/utils/colors'
    // import Popper from 'vue3-popper'

    // const formatHour = (time) => {
    //     const date = new Date(time)
    //     return (
    //         (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
    //         (date.getMinutes() > 0
    //             ? ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    //             : 'h')
    //     )
    // }

    const props = defineProps({
        events: {
            type: Array,
            required: true,
        },
    })
</script>

<style>
    /* stylelint-disable */
    .vuecal__event {
        position: relative;
        padding: 0;
        background-color: none;
        border: 0;
    }

    .vuecal__event:focus,
    .vuecal__event:hover {
        overflow: visible;
        background-color: none;
        box-shadow: none;
    }
    .vuecal__cells.month-view .vuecal__cell,
    .vuecal__cells.week-view .vuecal__cell {
        min-height: 4em;
    }

    .vuecal__cell-events-count {
        background: none;
    }
</style>
