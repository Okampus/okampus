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
        <template #event="{ event, view }">
            <div v-if="view" class="p-4 m-0 w-full">
                <Popper :prevent-overflow="false" :interactive="true">
                    <div
                        class="absolute inset-0 self-stretch p-1 m-0 mr-3 h-full text-sm leading-tight text-white rounded-r-md rounded-l-sm border-l-4 border-yellow-400 hover:shadow-xl focus:shadow-xl hover:scale-[1.01] focus:scale-[1.01]"
                        :style="{ 'background-color': getColorFromData(event.event.team.category) }"
                    >
                        <div class="flex gap-2 items-center">
                            <ProfileAvatar
                                :size="2"
                                :avatar="event.event.team.avatar"
                                :name="event.event.team.name"
                            />
                            <p class="truncate">{{ event.title }}</p>
                        </div>
                    </div>
                    <template #content>
                        <div class="flex z-50 flex-col gap-4 p-6 w-96 rounded-md bg-2">
                            <div class="flex items-center">
                                <i
                                    class="mr-4 w-4 h-4 fas fa-circle"
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
                                <i class="mr-4 w-4 h-4 text-gray-500 fas fa-location-dot"> </i>
                                <p class="">{{ event.event.place }}</p>
                            </div>
                            <div class="flex items-center">
                                <i class="mr-4 w-4 h-4 text-gray-500 fas fa-euro-sign"> </i>
                                <p class="">
                                    {{ event.event.price > 0 ? event.event.price : 'Gratuit' }}
                                </p>
                            </div>
                            <p>
                                <a
                                    :href="`#/events/${event.event.teamEventId}`"
                                    class="py-1 px-4 w-fit text-sm font-bold text-center text-white bg-green-500 rounded-full"
                                    >En savoir plus</a
                                >
                            </p>
                        </div>
                    </template>
                </Popper>
            </div>
        </template>
    </vue-cal>
</template>

<script setup>
    import VueCal from 'vue-cal'
    import 'vue-cal/dist/vuecal.css'
    import 'vue-cal/dist/i18n/fr.js'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { getColorFromData } from '@/utils/colors'
    import Popper from 'vue3-popper'

    const formatHour = (time) => {
        const date = new Date(time)
        return (
            (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
            (date.getMinutes() > 0
                ? ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
                : 'h')
        )
    }

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
