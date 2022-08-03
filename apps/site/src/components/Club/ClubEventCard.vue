<template>
    <div
        class="card-hover bg-2 text-0 relative flex w-full min-w-[13rem] max-w-[40rem] flex-col rounded-xl pb-4 sm:w-[calc(50%-1rem)] xl:w-[calc(33%-1rem)]"
    >
        <div class="relative">
            <ProfileBanner class="h-40" :name="event.shortDescription" :data="event.team.category" />
            <router-link :to="`/club/${event.team.id}`" class="absolute bottom-[2.5rem] right-4">
                <ProfileAvatar :size="3.5" :name="event.team.name" :avatar="event.team.avatar" />
            </router-link>

            <div class="absolute top-4 left-4 z-20 flex flex-col items-center gap-4">
                <div class="bg-1 h-[4.3rem] w-[3.8rem] rounded-lg py-1.5 shadow-md">
                    <div class="text-center text-3xl font-semibold">{{ startDate.getDate() }}</div>
                    <div class="text-2 text-center text-sm font-semibold uppercase">
                        {{ startMonth }}
                    </div>
                </div>

                <span
                    v-if="startDate > now"
                    v-tooltip="
                        `Commence dans ${countdown.value} ${
                            countdown.type === 'days'
                                ? `jour${countdown.value > 0 ? 's' : ''}`
                                : `heure${countdown.value > 0 ? 's' : ''}`
                        } !`
                    "
                    class="bg-1 text-0 whitespace-nowrap rounded-md px-2 text-base"
                >
                    {{ startDate > now ? countdownString : 'Passé' }}
                </span>
            </div>

            <span class="bg-1 text-0 absolute top-4 right-4 whitespace-nowrap rounded-md py-1 px-2 text-base">
                {{ event.price === 0 ? 'Gratuit 🎉' : `${event.price} €` }}
            </span>
        </div>

        <div class="mx-6 flex h-full flex-col justify-between">
            <div class="mt-4 flex flex-col gap-3.5">
                <router-link :to="`/event/${event.id}`" class="card-link text-2xl font-semibold">{{
                    event.name
                }}</router-link>
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 text-lg">
                        <div class="w-7">📍</div>
                        <div class="text-[0.9rem] line-clamp-1">{{ event.location }}</div>
                    </div>
                    <div class="flex items-center gap-2 text-lg">
                        <div class="w-7">📅</div>
                        <div class="text-[0.9rem] line-clamp-1">{{ dateRangeString }}</div>
                    </div>
                </div>
            </div>
            <AvatarGroup
                class="mt-4"
                spacing-class="-space-x-2"
                :users="
                    event.registrations.map((registration) => ({
                        id: registration.user.id,
                        firstname: registration.user.firstname,
                        lastname: registration.user.lastname,
                        avatar: registration.user.avatar,
                        status: registration.status,
                    }))
                "
                :show-presence="true"
            />
            <div v-if="$slots.buttons" class="mb-2 mt-6 self-center">
                <slot name="buttons" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import AvatarGroup from '@/components/List/AvatarGroup.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'

    import { getDateRangeStringShort, getCountdown } from '@/utils/dateUtils'

    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n({ useScope: 'global' })

    const props = defineProps({
        event: {
            type: Object,
            required: true,
        },
    })

    console.log('EVENT', props.event)

    const getMonth = new Intl.DateTimeFormat(locale.value, {
        month: 'short',
    })
    const startDate = new Date(props.event.start)
    const endDate = new Date(props.event.end)

    const now = new Date()

    const startMonth = getMonth.format(startDate)
    const dateRangeString = getDateRangeStringShort(startDate, endDate, true)
    const countdown = getCountdown(now, startDate)
    const countdownString = `${countdown.type === 'days' ? 'J' : 'H'}-${countdown.value}`
</script>
