<template>
    <!-- TODO: Refactor all my-auto -->
    <div class="text-2 card-2">
        <HorizontalTabs
            v-model="currentTab"
            route-base="/me/clubs"
            route-name="me"
            :tabs="tabs"
            class="ml-4"
        />
        <div class="divide-y divide-gray-500/40 text-0">
            <template v-if="currentTab === MEMBER">
                <template v-if="clubs.userMemberships.length">
                    <div
                        v-for="membership in clubs.userMemberships"
                        :key="membership.team.teamId"
                        class="flex justify-between items-center py-2"
                    >
                        <div class="flex gap-3">
                            <ProfileAvatar
                                :avatar="membership.team.avatar"
                                :name="membership.team.name"
                                :size="3.5"
                                :rounded-full="false"
                            />
                            <div class="flex flex-col">
                                <div class="flex gap-1.5 font-semibold text-1">
                                    <div class="font-semibold">{{ membership.team.name }}</div>
                                    <div>•</div>
                                    <div class="text-2">{{ clubRoleNames[membership.role].fr }}</div>
                                </div>
                            </div>
                        </div>

                        <router-link
                            v-if="specialRoles.includes(membership.role)"
                            :to="`/club/${membership.team.teamId}/manage`"
                            class="text-lg button-submit"
                            >Gérer</router-link
                        >

                        <router-link
                            v-else
                            :to="`/club/${membership.team.teamId}`"
                            class="text-lg button-submit"
                            >Voir le profil</router-link
                        >
                    </div>
                </template>
                <div v-else class="flex flex-col gap-4 items-center my-6">
                    <div class="text-lg text-2">Vous n'êtes actuellement membre d'aucune association.</div>
                    <i class="text-8xl fas fa-puzzle-piece" />

                    <router-link
                        class="mt-4 text-2xl text-blue-600 dark:text-blue-400 hover-arrow-right"
                        to="/clubs"
                        >Découvrir les associations<i class="ml-2 fa fa-arrow-right"
                    /></router-link>
                </div>
            </template>
            <template v-else-if="currentTab === REQUEST">
                <template v-if="clubs.userMembershipRequests.length">
                    <div
                        v-for="request in clubs.userMembershipRequests"
                        :key="request.teamMembershipRequestId"
                        class="flex justify-between items-center py-2"
                    >
                        <div class="flex gap-3">
                            <ProfileAvatar
                                :avatar="request.team.avatar"
                                :name="request.team.name"
                                :size="3.5"
                                :rounded-full="false"
                            />
                            <div class="flex flex-col">
                                <div class="flex gap-1.5 text-1">
                                    <div class="font-semibold">{{ request.team.name }}</div>
                                    <div class="text-sm">(comme {{ clubRoleNames[request.role].fr }})</div>
                                </div>
                                <div class="flex gap-1.5 text-sm">
                                    <div class="flex gap-1">
                                        <div>Demandé</div>
                                        <TipRelativeDate :date="request.createdAt" />
                                    </div>
                                    <template v-if="request.state === APPROVED">
                                        <div>•</div>
                                        <div class="flex gap-1">
                                            <div>{{ statusNames[APPROVED].fr }}</div>
                                            <TipRelativeDate :date="request.handledAt" />
                                        </div>
                                    </template>
                                    <template v-else-if="request.state === REJECTED">
                                        <div>•</div>
                                        <div class="flex gap-1">
                                            <div>{{ statusNames[REJECTED].fr }}</div>
                                            <TipRelativeDate :date="request.handledAt" />
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <div
                            class="flex gap-2 justify-center items-center py-1 px-3 w-36 text-white rounded-xl"
                            :class="{
                                'bg-green-500 hover:bg-green-600': request.state === APPROVED,
                                'bg-red-500 hover:bg-red-600': request.state === REJECTED,
                                'bg-gray-500/50 hover:bg-gray-600/50': request.state === PENDING,
                            }"
                        >
                            <template v-if="request.state === APPROVED">
                                <i class="fa fa-check" />
                                <div>{{ statusNames[APPROVED].fr }}</div>
                            </template>
                            <template v-else-if="request.state === REJECTED">
                                <i class="fa fa-xmark" />
                                <div>{{ statusNames[REJECTED].fr }}</div>
                            </template>
                            <template v-else-if="request.state === PENDING">
                                <i class="fa fa-envelope" />
                                <div>{{ statusNames[PENDING].fr }}</div>
                            </template>
                        </div>
                    </div>
                </template>
                <div v-else class="flex flex-col gap-4 items-center my-6">
                    <div class="text-lg text-2">Vous n'avez pas de demandes d'adhésion en cours.</div>
                    <i class="text-8xl fas fa-puzzle-piece" />

                    <router-link
                        class="mt-4 text-2xl text-blue-600 dark:text-blue-400 hover-arrow-right"
                        to="/clubs"
                        >Découvrir les associations<i class="ml-2 fa fa-arrow-right"
                    /></router-link>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'

    import { clubRoleNames, specialRoles } from '@/shared/types/club-roles.enum'
    import { APPROVED, REJECTED, PENDING, statusNames } from '@/shared/types/club-requests.enum'

    import { useClubsStore } from '@/store/clubs.store'
    import { useAuthStore } from '@/store/auth.store'
    import { ref } from 'vue'

    const auth = useAuthStore()
    const clubs = useClubsStore()

    const MEMBER = 'active'
    const REQUEST = 'requests'

    const currentTab = ref(null)

    const tabs = [
        {
            id: MEMBER,
            name: 'Actives',
            route: '/me/clubs',
            icon: 'users',
            component: 'club-members',
        },
        {
            id: REQUEST,
            name: 'Demandes en cours',
            icon: 'envelope',
            component: 'club-settings',
        },
    ]

    await Promise.all([clubs.getMembershipsOf(auth.user), clubs.getMembershipRequestsOf(auth.user)])
</script>

<style lang="scss">
    .hover-arrow-right {
        transition: color 0.3s ease-in-out;

        & i {
            transition: transform 0.3s ease-in-out;
        }

        &:hover {
            @apply text-blue-600;

            .dark & {
                color: #0af;
            }

            & i {
                transform: translateX(6px);
            }
        }
    }
</style>
