<template>
    <div class="card-hover bg-2 text-0 relative flex max-w-[25rem] flex-col rounded-xl pb-4">
        <div class="relative">
            <ProfileBanner class="h-32" :name="event.shortDescription" :data="event.team.category" />
            <router-link :to="`/club/${event.team.id}`" class="absolute bottom-4 right-4">
                <ProfileAvatar
                    :size="3.5"
                    :name="event.team.name"
                    :avatar="event.team.avatar"
                    :rounded-full="false"
                />
            </router-link>

            <div
                class="absolute top-4 left-4 z-20 flex flex-col items-center gap-2"
                @mouseover="showLink = false"
                @mouseleave="showLink = true"
            >
                <div class="bg-1 h-[4rem] w-[4rem] rounded-lg py-1 shadow-md">
                    <div class="text-center text-3xl font-semibold">{{ startDate.getDate() }}</div>
                    <div class="text-2 text-center text-sm font-semibold uppercase">
                        {{ startMonth }}
                    </div>
                </div>

                <span
                    v-tooltip="
                        startDate > now
                            ? `Commence dans ${countdown.value} ${
                                  countdown.type === 'days'
                                      ? `jour${countdown.value > 0 ? 's' : ''}`
                                      : `heure${countdown.value > 0 ? 's' : ''}`
                              } !`
                            : 'Événement passé'
                    "
                    class="whitespace-nowrap rounded-md px-2 py-0.5 text-base"
                    :class="startDate > now ? 'bg-1' : 'bg-gray-700 text-white'"
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
                <div class="flex flex-wrap items-center gap-1">
                    <router-link
                        :to="`/event/${event.id}`"
                        class="text-2xl font-medium"
                        :class="{ 'card-link': showLink }"
                        >{{ event.name }}</router-link
                    >
                    <div v-if="event.state === DRAFT" class="text-lg text-red-400">[Brouillon]</div>
                </div>
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
                :entities="
                    event.registrations.map((registration) => ({
                        id: registration.user.id,
                        firstname: registration.user.firstname,
                        lastname: registration.user.lastname,
                        avatar: registration.user.avatar,
                        status: registration.status,
                    }))
                "
                :show-presence="true"
                @mouseover="showLink = false"
                @mouseleave="showLink = true"
            />
            <div
                v-if="$slots.buttons"
                class="mt-2 flex w-full justify-center"
                @mouseover="showLink = false"
                @mouseleave="showLink = true"
            >
                <slot name="buttons" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import AvatarGroup from '@/components/List/AvatarGroup.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'

    import { DRAFT } from '@/shared/types/event-states.enum'

    import { getDateRangeStringShort, getCountdown } from '@/utils/dateUtils'
    import { ref } from 'vue'

    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n({ useScope: 'global' })

    const props = defineProps({
        event: {
            type: Object,
            required: true,
        },
    })

    const showLink = ref(true)

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
