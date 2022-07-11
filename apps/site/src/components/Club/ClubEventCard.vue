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
            <div class="flex flex-col gap-3.5 self-start mt-4">
                <div class="flex flex-col">
                    <router-link
                        :to="`/events/${event.teamEventId}`"
                        class="text-lg font-bold hover:underline"
                        >{{ event.name }}</router-link
                    >

                    <div class="flex gap-2 items-center text-lg">
                        <TipRelativeDate
                            :date="event.start"
                            :limit="false"
                            text-class="font-semibold uppercase text-base"
                        />
                        <div v-if="startDate > now" class="italic font-semibold text-blue-500">
                            {{ countdown }}
                        </div>
                        <LabelSimple v-else class="!bg-gray-500 !hover:bg-gray-500">Passé</LabelSimple>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex gap-2 items-center">
                        <div class="w-6">📍</div>
                        <div class="text-sm tracking-tight">{{ event.place }}</div>
                    </div>
                    <div class="flex gap-2 items-start">
                        <div class="w-6">📅</div>
                        <div class="flex flex-col gap-1 text-sm tracking-tight">
                            <div>{{ dateRangeString }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="self-center my-6">
                <router-link
                    :to="`/events/${event.teamEventId}`"
                    class="hidden font-semibold rounded-full md:block button-blue"
                >
                    Rejoindre l'événement
                </router-link>
                <router-link
                    :to="`/events/${event.teamEventId}`"
                    class="block font-semibold rounded-full md:hidden button-blue"
                >
                    Rejoindre
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { i18n } from '@/shared/modules/i18n'
    import { getDateRangeString, getCountdown } from '@/utils/dateUtils'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'
    import LabelSimple from '../UI/Label/LabelSimple.vue'

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

    const now = new Date()

    const startMonth = getMonth.format(startDate)
    const dateRangeString = getDateRangeString(startDate, endDate)
    const countdown = getCountdown(now, startDate)
</script>
