<template>
    <div>
        <ProfileBanner :name="fullname(user)" :banner="user.banner" class="p-0 h-32" :rounded-top="false" />
        <div class="py-4 centered-container text-0">
            <div class="flex gap-4 items-center -mt-[4rem]">
                <ProfileAvatar
                    :avatar="user.avatar"
                    :size="8"
                    :name="fullname(user)"
                    inner-class="border-4 border-white dark:border-black !sahdow-none"
                />
                <div class="flex flex-col mt-14">
                    <p class="text-3xl font-semibold">{{ fullname(user) }}</p>
                    <p class="text-lg text-2">{{ user.shortDescription }}</p>
                </div>
            </div>
            <div class="flex flex-col gap-10 justify-between md:flex-row">
                <div>
                    <h2 class="my-4 text-2xl font-semibold">Associations</h2>
                    <div
                        v-if="memberships.length > 0"
                        class="flex flex-wrap gap-x-4 gap-y-2 items-center mt-4 w-full"
                    >
                        <div v-for="membership in memberships" :key="membership" class="flex gap-2">
                            <router-link :to="`/club/${membership.team.teamId}`">
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
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-lg italic">
                        {{ user.firstname.split(' ')[0] }} ne fait pas partie d'une association.
                    </p>
                </div>
                <div>
                    <h2 class="my-4 text-2xl font-semibold">Activité</h2>
                    <div v-if="events.length > 0" class="flex flex-col gap-4 w-fit">
                        <ClubEventCard v-for="event in events" :key="event" :event="event"></ClubEventCard>
                    </div>
                    <div v-else class="flex flex-col gap-4 w-fit">Pas d'activité</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    // import ThreadPreviewCard from '@/components/App/Card/ThreadPreviewCard.vue'
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'

    import { watch, ref, nextTick } from 'vue'

    import { useRoute } from 'vue-router'

    import { useClubsStore } from '@/store/clubs.store'
    import { useUsersStore } from '@/store/users.store'

    import { emitter } from '@/shared/modules/emitter'

    import { getStatusAxiosError } from '@/utils/errors'
    import { fullname } from '@/utils/users'

    import { clubRoleNames } from '@/shared/types/club-roles.enum'
    import { specialRoles } from '@/shared/types/club-roles.enum'

    const route = useRoute()

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
                nextTick(() => {
                    if (route.hash) {
                        emitter.emit('scroll-to-anchor', route.hash)
                    }
                })
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
                nextTick(() => {
                    if (route.hash) {
                        emitter.emit('scroll-to-anchor', route.hash)
                    }
                })
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

<style lang="scss">
    .banner {
        background-color: #771250;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='96' viewBox='0 0 60 96'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2335313c' fill-opacity='0.44'%3E%3Cpath d='M36 10a6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-12 0 6 6 0 0 0-6-6 6 6 0 0 1-6-6V10a6 6 0 1 1 12 0 6 6 0 0 0 12 0zm24 78a6 6 0 0 1-6-6 6 6 0 0 0-6-6 6 6 0 0 1-6-6V58a6 6 0 1 1 12 0 6 6 0 0 0 6 6v24zM0 88V64a6 6 0 0 0 6-6 6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-6 6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
</style>
