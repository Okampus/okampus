<template>
    <div
        class="card-hover bg-2 text-0 flex w-full min-w-[13rem] max-w-[40rem] flex-col rounded-xl sm:w-[calc(50%-1rem)] xl:w-[calc(33%-1rem)]"
    >
        <!-- <div class="flex gap-4 p-4">
            <router-link :to="`/club/${event.team.id}`">
                <ProfileAvatar :name="event.team.name" :avatar="event.team.avatar" />
            </router-link>
            <div class="flex flex-col">
                <div class="flex gap-1 items-center">
                    <div class="text-sm">Organisé par</div>
                    <router-link
                        :to="`/club/${event.team.id}`"
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
            <ProfileBanner class="h-24" :name="event.shortDescription" :data="event.team.category" />
            <router-link :to="`/club/${event.team.id}`" class="absolute top-4 right-4">
                <ProfileAvatar :name="event.team.name" :avatar="event.team.avatar" />
            </router-link>
            <div class="bg-1 text-0 absolute top-4 left-4 rounded-lg py-1 px-2">
                {{ event.price === 0 ? 'Gratuit&nbsp; 🎉' : `Prix : ${event.price} €` }}
            </div>
        </div>

        <div class="bg-1 z-20 mx-4 -mt-[2rem] h-16 w-14 rounded-lg py-1.5 shadow-md">
            <div class="text-center text-xl font-bold">{{ startDate.getDate() }}</div>
            <div class="text-center font-semibold text-red-500/90 dark:text-red-400">{{ startMonth }}</div>
        </div>

        <div class="mx-5 flex h-full flex-col justify-between">
            <div class="mt-4 flex flex-col gap-3.5 self-start">
                <div class="flex flex-col">
                    <router-link
                        :to="`/events/${event.teamEventId}`"
                        class="text-lg font-bold hover:underline"
                        >{{ event.name }}</router-link
                    >

                    <div class="flex items-center gap-2 text-lg">
                        <TipRelativeDate
                            :date="event.start"
                            :limit="false"
                            text-class="font-semibold uppercase text-base"
                        />
                        <div v-if="startDate > now" class="font-semibold italic text-blue-500">
                            {{ countdown }}
                        </div>
                        <LabelSimple v-else class="!hover:bg-gray-500 !bg-gray-500">Passé</LabelSimple>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                        <div class="w-6">📍</div>
                        <div class="text-sm tracking-tight">{{ event.place }}</div>
                    </div>
                    <div class="flex items-start gap-2">
                        <div class="w-6">📅</div>
                        <div class="flex flex-col gap-1 text-sm tracking-tight">
                            <div>{{ dateRangeString }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="my-6 self-center">
                <router-link
                    :to="`/events/${event.teamEventId}`"
                    class="button-blue hidden rounded-full font-semibold md:block"
                >
                    Rejoindre l'événement
                </router-link>
                <router-link
                    :to="`/events/${event.teamEventId}`"
                    class="button-blue block rounded-full font-semibold md:hidden"
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
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'

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
