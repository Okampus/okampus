<template>
    <div
        class="flex flex-col w-full min-w-[13rem] max-w-[40rem] rounded-xl sm:w-[calc(50%-1.5rem)] xl:w-[calc(33%-1.5rem)] card-hover bg-2 text-0"
    >
        <!-- <div class="flex gap-4 p-4">
            <router-link :to="`/club/${event.team.teamId}`">
                <ProfileAvatar :name="event.team.name" :avatar="event.team.avatar" />
            </router-link>
            <div class="flex flex-col">
                <div class="flex gap-1 items-center">
                    <div class="text-sm">Organisé par</div>
                    <router-link
                        :to="`/club/${event.team.teamId}`"
                        class="text-lg font-semibold hover:underline text-0"
                        >{{ event.team.name }}</router-link
                    >
                </div>
                <div class="flex gap-1 text-sm text-2">
                    <div>Ajouté</div>
                    <TipRelativeDate :date="event.createdAt" />
                </div>
            </div>
        </div> -->

        <div class="relative">
            <ProfileBanner class="h-24" :name="event.shortDescription" :data="event.team.name" />
            <router-link :to="`/club/${event.team.teamId}`" class="absolute top-4 right-4">
                <ProfileAvatar :name="event.team.name" :avatar="event.team.avatar" />
            </router-link>
            <div class="absolute top-4 left-4 py-1 px-2 rounded-lg bg-1 text-0">
                {{ event.price === 0 ? 'Gratuit&nbsp; 🎉' : `Prix : ${event.price} €` }}
            </div>
        </div>

        <div class="z-20 py-1.5 mx-4 -mt-[2rem] w-14 h-16 rounded-lg shadow-md bg-1">
            <div class="text-xl font-bold text-center">{{ startDate.getDate() }}</div>
            <div class="font-semibold text-center text-red-500/90 dark:text-red-400">{{ startMonth }}</div>
        </div>

        <div class="flex flex-col justify-between mx-5 h-full">
            <div class="flex flex-col gap-1 self-start mt-4">
                <router-link :to="`/events/${event.teamEventId}`" class="font-bold hover:underline">{{
                    event.name
                }}</router-link>
                <div class="flex gap-2 items-center">
                    <div class="w-6">📅</div>
                    <div class="text-sm tracking-tight">{{ dateRangeString }}</div>
                </div>
                <div class="flex gap-2 items-center">
                    <div class="w-6">📍</div>
                    <div class="text-sm tracking-tight">{{ event.place }}</div>
                </div>
                <!-- <div class="text-xs font-semibold uppercase text-3">{{ dateRangeString }}</div>
                <div class="self-start mt-2 text-lg font-bold">{{ event.shortDescription }}</div>
                <div class="flex gap-2 self-start text-sm text-3">
                    <div>{{ event.price === 0 ? 'Gratuit' : `Prix: ${event.price}` }}</div>
                    <div>•</div>
                    <div class="flex gap-2 items-center text-2">
                        <i class="text-xs fas fa-location-dot"></i>
                        <div>{{ event.place }}</div>
                    </div>
                </div> -->
            </div>

            <div class="self-center my-6">
                <router-link
                    :to="`/events/${event.teamEventId}`"
                    class="hidden font-semibold rounded-full xs:block button-blue"
                >
                    Rejoindre l'événement
                </router-link>
                <router-link
                    :to="`/events/${event.teamEventId}`"
                    class="block font-semibold rounded-full xs:hidden button-blue"
                >
                    Rejoindre
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { i18n } from '@/shared/modules/i18n'

    import ProfileAvatar from '../Profile/ProfileAvatar.vue'
    import ProfileBanner from '../Profile/ProfileBanner.vue'
    // import TipRelativeDate from '../UI/Tip/TipRelativeDate.vue'
    // import { useClubsStore } from '@/store/clubs.store'
    // import { emitter } from '@/shared/modules/emitter'
    const props = defineProps({
        event: {
            type: Object,
            required: true,
        },
    })

    const getMonth = new Intl.DateTimeFormat(i18n.global.locale, {
        month: 'short',
    })
    const startDate = new Date(props.event.start)
    const endDate = new Date(props.event.end)

    const startMonth = getMonth.format(startDate)

    const fullDateFormat = new Intl.DateTimeFormat(i18n.global.locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    })

    const dateRangeString = fullDateFormat.formatRange(startDate, endDate)
</script>
