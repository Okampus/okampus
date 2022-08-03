<template>
    <GraphQLQuery
        :query="getUser"
        :variables="{ id: route.params.userId }"
        :update="(data) => data?.userById"
    >
        <template #default="{ data: user }">
            <ProfileBanner
                :name="fullname(user)"
                :banner="user.banner"
                class="h-40 p-0"
                :rounded-top="false"
            />
            <div class="centered-container-padded text-0 flex flex-col">
                <div class="-mt-[5rem] flex gap-4">
                    <ProfileAvatar
                        :avatar="user.avatar"
                        :size="9"
                        :name="fullname(user)"
                        inner-class="border-4 border-white dark:border-black !shadow-none"
                    />
                    <div class="mt-20 flex w-full items-start justify-between gap-10 md:mt-16">
                        <div class="flex flex-col">
                            <p class="text-3xl font-semibold">{{ fullname(user) }}</p>
                            <p class="text-2 text-lg">{{ user.shortDescription }}</p>
                        </div>
                        <button
                            v-if="auth.user.id === route.params.userId"
                            class="button-green pill-button"
                            @click="router.push(`/me`)"
                        >
                            <i class="fas fa-gear" />
                            Gérer mon profil
                        </button>
                    </div>
                </div>
                <div class="flex flex-col justify-between gap-10 md:flex-row">
                    <div class="flex flex-col gap-4">
                        <h2 class="my-4 text-2xl font-semibold">Associations</h2>
                        <div
                            v-if="user.teamMemberships.length > 0"
                            class="mt-4 flex w-full flex-wrap items-center gap-x-4 gap-y-2"
                        >
                            <TeamActivity
                                v-for="(membership, i) in user.teamMemberships"
                                :key="i"
                                :team="membership.team"
                                class="w-40"
                            >
                                <template #subtitle>
                                    {{ clubRoleNames[membership.role][locale] }}
                                </template>
                            </TeamActivity>
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
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'
    import TeamActivity from '@/components/App/General/TeamActivity.vue'

    import { ref } from 'vue'

    import { useRoute, useRouter } from 'vue-router'

    import { useAuthStore } from '@/store/auth.store'
    import { fullname } from '@/utils/users'

    import { clubRoleNames } from '@/shared/types/club-roles.enum'
    import { getUser } from '@/graphql/queries/users/getUserById.js'

    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n({ useScope: 'global' })

    const route = useRoute()
    const router = useRouter()

    const auth = useAuthStore()

    // TODO: events
    const events = ref([])
</script>
