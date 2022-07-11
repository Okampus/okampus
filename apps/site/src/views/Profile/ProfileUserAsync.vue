<template>
    <ProfileBanner :name="fullname(user)" :banner="user.banner" class="p-0 h-40" :rounded-top="false" />
    <div class="centered-container-padded text-0">
        <div class="flex gap-4 -mt-[5rem]">
            <ProfileAvatar
                :avatar="user.avatar"
                :size="9"
                :name="fullname(user)"
                inner-class="border-4 border-white dark:border-black !sahdow-none"
            />
            <div class="flex gap-10 justify-between items-start w-full">
                <div class="flex flex-col mt-20 md:mt-16">
                    <p class="text-3xl font-semibold">{{ fullname(user) }}</p>
                    <p class="text-lg text-2">{{ user.shortDescription }}</p>
                </div>
                <router-link
                    v-if="auth.user.userId === userId"
                    to="/me"
                    role="button"
                    class="flex gap-2 items-center mt-20 font-semibold rounded-full md:mt-16 button-green"
                >
                    <i class="fas fa-gear" />
                    Paramètres
                </router-link>
            </div>
        </div>

        <div class="flex flex-col gap-10 justify-between md:flex-row">
            <div class="flex flex-col gap-4">
                <h2 class="my-4 text-2xl font-semibold">Associations</h2>
                <div
                    v-if="memberships.length > 0"
                    class="flex flex-wrap gap-x-4 gap-y-2 items-center mt-4 w-full"
                >
                    <TeamActivity
                        v-for="membership in memberships"
                        :key="membership"
                        :team="membership.team"
                        :custom-string="clubRoleNames[membership.role].fr"
                        class="w-40"
                    />
                    <!-- <router-link :to="`/club/${membership.team.teamId}`">
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
                            <router-link :to="`/club/${membership.team.teamId}`" class="hover:underline">
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

            <div class="flex flex-col shrink-0 gap-4 w-[20rem]">
                <h2 class="my-4 text-2xl font-semibold">Activité</h2>

                <div v-if="events.length > 0" class="flex flex-col gap-4 w-fit">
                    <ClubEventCard
                        v-for="event in events"
                        :key="event.eventId"
                        :event="event"
                        class="!w-full"
                    ></ClubEventCard>
                </div>
                <div v-else class="flex flex-col gap-4 w-fit">Aucune activité récente</div>
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
    const userId = ref(route.params.userId)

    const memberships = ref(null)
    const events = ref([])

    const loadUser = async () => {
        await users
            .getUser(userId.value)
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
                        if (guests.items.find((guest) => guest.user.userId === userId.value)) {
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
            .getMembershipsOf({ userId: userId.value })
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
            userId.value = route.params.userId

            await loadUser()
            await loadMemberships()
            await loadEvents()
        }
    }

    await loadProfile()

    watch(
        () => route.params.userId,
        async () => {
            await loadProfile()
        },
    )
</script>
