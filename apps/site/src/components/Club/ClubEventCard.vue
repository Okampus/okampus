<template>
    <div class="flex flex-col min-w-[20rem] max-w-[30rem] rounded-xl bg-2 text-0">
        <div class="flex gap-4 p-4">
            <ProfileAvatar :name="event.team.name" :avatar="event.team.avatar" />
            <div class="flex flex-col">
                <div class="flex gap-1 items-center">
                    <div class="text-sm">Organisé par</div>
                    <router-link :to="`/club/${event.team.teamId}`" class="text-lg font-semibold text-0">{{
                        event.team.name
                    }}</router-link>
                </div>
                <div class="flex gap-1 text-sm text-2">
                    <div>Ajouté</div>
                    <TipRelativeDate :date="event.createdAt" />
                </div>
            </div>
        </div>

        <ProfileBanner
            class="h-24"
            :name="event.shortDescription"
            :data="event.team.name"
            :rounded-top="false"
        />

        <div class="z-20 py-1.5 mx-4 -mt-[2.5rem] w-14 h-16 rounded-lg shadow-md bg-1">
            <div class="text-xl font-bold text-center">{{ startDate.getDate() }}</div>
            <div class="font-semibold text-center text-red-500/90 dark:text-red-400">{{ startMonth }}</div>
        </div>

        <div class="flex flex-col justify-between mx-5">
            <div class="flex flex-col gap-1 self-start mt-4">
                <div class="text-xs font-semibold uppercase text-3">{{ dateRangeString }}</div>
                <div class="self-start mt-2 text-lg font-bold">{{ event.shortDescription }}</div>
                <div class="flex gap-2 self-start text-sm text-3">
                    <div>{{ event.price === 0 ? 'Gratuit' : `Prix: ${event.price}` }}</div>
                    <div>•</div>
                    <div class="flex gap-2 items-center text-2">
                        <i class="text-xs fas fa-location-dot"></i>
                        <div>{{ event.place }}</div>
                    </div>
                </div>
            </div>

            <div class="self-center my-6">
                <router-link
                    :to="`/events/${event.teamEventId}`"
                    class="py-2 px-4 w-1/2 font-bold text-white bg-blue-500 rounded-full"
                >
                    Plus d'informations
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ProfileAvatar from '../Profile/ProfileAvatar.vue'
    import ProfileBanner from '../Profile/ProfileBanner.vue'
    import TipRelativeDate from '../UI/Tip/TipRelativeDate.vue'
    // import { useClubsStore } from '@/store/clubs.store'
    // import { emitter } from '@/shared/modules/emitter'
    const props = defineProps({
        event: {
            type: Object,
            required: true,
        },
    })

    const format = new Intl.DateTimeFormat('fr', {
        month: 'short',
    })
    const startDate = new Date(props.event.start)
    const endDate = new Date(props.event.end)

    const startMonth = format.format(startDate)
    const endMonth = format.format(endDate)

    const dateRangeString = `${startDate.getDate()} ${startMonth} ${startDate.getHours()}h${
        startDate.getMinutes() ? startDate.getMinutes().toString().padStart(2, '0') : ''
    } - ${endDate.getDate()} ${endMonth} ${endDate.getHours()}h${
        endDate.getMinutes() ? endDate.getMinutes().toString().padStart(2, '0') : ''
    }`
</script>
