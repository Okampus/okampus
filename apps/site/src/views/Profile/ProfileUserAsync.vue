<template>
    <div>
        <ProfileBanner :name="fullname(user)" :banner="user.banner" class="h-40 p-0" :rounded-top="false" />
        <div class="centered-container-padded text-0 flex flex-col">
            <div class="-mt-[5rem] flex gap-4">
                <ProfileAvatar
                    :avatar="user.avatar"
                    :size="9"
                    :name="fullname(user)"
                    inner-class="border-4 border-white dark:border-black !sahdow-none"
                />
                <div class="flex w-full items-start justify-between gap-10">
                    <div class="mt-20 flex flex-col md:mt-16">
                        <p class="text-3xl font-semibold">{{ fullname(user) }}</p>
                        <p class="text-2 text-lg">{{ user.shortDescription }}</p>
                    </div>
                    <router-link
                        v-if="auth.user.id === id"
                        to="/me"
                        role="button"
                        class="button-green mt-20 flex items-center gap-2 rounded-full font-semibold md:mt-16"
                    >
                        <i class="fas fa-gear" />
                        Paramètres
                    </router-link>
                </div>
            </div>
            <div class="flex flex-col justify-between gap-10 md:flex-row">
                <div class="flex flex-col gap-4">
                    <h2 class="my-4 text-2xl font-semibold">Associations</h2>
                    <div
                        v-if="memberships.length > 0"
                        class="mt-4 flex w-full flex-wrap items-center gap-x-4 gap-y-2"
                    >
                        <TeamActivity
                            v-for="membership in memberships"
                            :key="membership"
                            :team="membership.team"
                            :custom-string="clubRoleNames[membership.role].fr"
                            class="w-40"
                        />
                        <!-- <router-link :to="`/club/${membership.team.id}`">
                                <ProfileAvatar
                                    :avatar="membership.team.avatar"
                                    :size="2"
                                    :name="membership.team.name"
                                    :class="
                                        specialRoles.find((role) => role === membership.role)
                                            ? 'border-2 h-fit border-yellow-300 rounded-full'
                                            : ''
                                    "
                                />
                            </router-link>
                            <div class="flex flex-col justify-center">
                                <router-link :to="`/club/${membership.team.id}`" class="hover:underline">
                                    <p class="w-32 font-semibold truncate">{{ membership.team.name }}</p>
                                </router-link>
                                <p class="-mt-2 w-32 truncate">{{ clubRoleNames[membership.role].fr }}</p>
                            </div> -->
                        <!-- </div> -->
                    </div>
                    <p v-else class="text-lg italic">
                        {{ user.firstname.split(' ')[0] }} ne fait pas partie d'associations.
                    </p>
                </div>
                <div class="flex w-[20rem] shrink-0 flex-col gap-4">
                    <h2 class="my-4 text-2xl font-semibold">Activité</h2>
                    <div v-if="events.length > 0" class="flex w-fit flex-col gap-4">
                        <ClubEventCard
                            v-for="event in events"
                            :key="event.eventId"
                            :event="event"
                            class="!w-full"
                        ></ClubEventCard>
                    </div>
                    <div v-else class="flex w-fit flex-col gap-4">Aucune activité récente</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'
    import TeamActivity from '@/components/App/General/TeamActivity.vue'

    import { watch, ref } from 'vue'

    import { useRoute } from 'vue-router'

    import { useAuthStore } from '@/store/auth.store'
    import { useUsersStore } from '@/store/users.store'
    import { useClubsStore } from '@/store/clubs.store'

    import { emitter } from '@/shared/modules/emitter'

    import { getStatusAxiosError } from '@/utils/errors'
    import { fullname } from '@/utils/users'

    import { clubRoleNames } from '@/shared/types/club-roles.enum'
    // import { specialRoles } from '@/shared/types/club-roles.enum'

    const route = useRoute()

    const auth = useAuthStore()
    const users = useUsersStore()
    const clubs = useClubsStore()

    const user = ref(null)
    const id = ref(route.params.id)

    const memberships = ref(null)
    const events = ref([])

    const loadUser = async () => {
        await users
            .getUser(id.value)
            .then((userData) => {
                user.value = userData
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatusAxiosError(err) })
            })
    }

    const loadEvents = async () => {
        await clubs
            .getEvents()
            .then((teamEvents) => {
                teamEvents.forEach(async (event) => {
                    await clubs.getEventGuests(event.teamEventId).then((guests) => {
                        if (guests.items.find((guest) => guest.user.id === id.value)) {
                            events.value.push(event)
                        }
                    })
                })
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatusAxiosError(err) })
            })
    }

    const loadMemberships = async () => {
        await clubs
            .getMembershipsOf({ id: id.value })
            .then((userMemberships) => {
                memberships.value = userMemberships
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatusAxiosError(err) })
            })
    }

    const loadProfile = async () => {
        if (route.name === 'user') {
            events.value = []
            id.value = route.params.id

            await loadUser()
            await loadMemberships()
            await loadEvents()
        }
    }

    await loadProfile()

    watch(
        () => route.params.id,
        async () => {
            await loadProfile()
        },
    )
</script>
