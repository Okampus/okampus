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
        <div class="text-0 divide-y divide-gray-500/40">
            <template v-if="currentTab === MEMBER">
                <template v-if="clubs.userMemberships.length">
                    <div
                        v-for="membership in clubs.userMemberships"
                        :key="membership.team.teamId"
                        class="flex items-center justify-between py-2"
                    >
                        <div class="flex gap-3">
                            <router-link :to="`/club/${membership.team.teamId}`">
                                <ProfileAvatar
                                    :avatar="membership.team.avatar"
                                    :name="membership.team.name"
                                    :size="3.5"
                                    :rounded-full="false"
                                />
                            </router-link>
                            <div class="flex flex-col">
                                <div class="text-1 flex gap-1.5 font-semibold">
                                    <router-link
                                        :to="`/club/${membership.team.teamId}`"
                                        class="hover:underline"
                                    >
                                        <div class="font-semibold">{{ membership.team.name }}</div>
                                    </router-link>
                                    <div>•</div>
                                    <div class="text-2">
                                        {{ clubRoleNames[membership.role][$i18n.locale] }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <button
                                v-if="specialRoles.includes(membership.role)"
                                class="button-red text-xs lg:text-lg"
                                @click="() => transferRole(membership)"
                            >
                                Transmettre le rôle
                            </button>
                            <button
                                v-else
                                class="button-red text-xs lg:text-lg"
                                @click="() => leaveClub(membership)"
                            >
                                Quitter
                            </button>
                            <router-link
                                v-if="specialRoles.includes(membership.role)"
                                :to="`/club/${membership.team.teamId}/manage`"
                                class="button-blue text-xs lg:text-lg"
                                >Gérer</router-link
                            >
                            <router-link
                                v-else
                                :to="`/club/${membership.team.teamId}`"
                                class="button-blue text-xs md:text-lg"
                                >Voir le profil</router-link
                            >
                        </div>
                    </div>
                </template>
                <div v-else class="my-6 flex flex-col items-center gap-4">
                    <img class="h-48 w-48" :src="Puzzle" />
                    <div class="text-2 text-lg">Vous n'êtes actuellement membre d'aucune association.</div>

                    <router-link class="button-blue mt-4 text-xl" to="/clubs"
                        >Découvrir les associations<i class="fa fa-arrow-right ml-2"
                    /></router-link>
                </div>
            </template>
            <template v-else-if="currentTab === REQUEST">
                <template v-if="clubs.userMembershipRequests.length">
                    <div
                        v-for="request in clubs.userMembershipRequests"
                        :key="request.teamMembershipRequestId"
                        class="flex items-center justify-between py-2"
                    >
                        <div class="flex gap-3">
                            <router-link :to="`/club/${request.team.teamId}`">
                                <ProfileAvatar
                                    :avatar="request.team.avatar"
                                    :name="request.team.name"
                                    :size="3.5"
                                    :rounded-full="false"
                                />
                            </router-link>
                            <div class="flex flex-col">
                                <div class="text-1 flex gap-1.5">
                                    <router-link :to="`/club/${request.team.teamId}`" class="hover:underline">
                                        <div class="font-semibold">{{ request.team.name }}</div>
                                    </router-link>
                                    <div class="text-sm">
                                        (comme {{ clubRoleNames[request.role][$i18n.locale] }})
                                    </div>
                                </div>
                                <div class="flex gap-1.5 text-sm">
                                    <div class="flex gap-1">
                                        <div class="text-2">Demandé</div>
                                        <TipRelativeDate :date="request.createdAt" />
                                    </div>
                                    <template v-if="request.state === APPROVED">
                                        <div>•</div>
                                        <div class="flex gap-1">
                                            <div class="text-2">
                                                {{ statusNames[APPROVED][$i18n.locale] }}
                                            </div>
                                            <TipRelativeDate :date="request.handledAt" />
                                        </div>
                                    </template>
                                    <template v-else-if="request.state === REJECTED">
                                        <div>•</div>
                                        <div class="flex gap-1">
                                            <div class="text-2">
                                                {{ statusNames[REJECTED][$i18n.locale] }}
                                            </div>
                                            <TipRelativeDate :date="request.handledAt" />
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <ModalPopup
                            :show="showRequestModal"
                            @close="showRequestModal = false"
                            @closed="shownRequest = null"
                        >
                            <template #default="{ close }">
                                <div class="card flex flex-col">
                                    <div class="mb-6 text-2xl">
                                        Formulaire d'adhésion à {{ shownRequest?.team?.name ?? '' }}
                                    </div>
                                    <div class="flex flex-col gap-4">
                                        <div>
                                            <div class="text-base text-gray-400/80">Rôle souhaité</div>
                                            <div class="text-0 text-xl">
                                                {{
                                                    clubRoleNames[shownRequest?.role ?? '']?.[$i18n.locale] ??
                                                    ''
                                                }}
                                            </div>
                                        </div>
                                        <div
                                            v-for="[field, value] in Object.entries(shownRequest?.meta ?? {})"
                                            :key="field"
                                        >
                                            <div class="text-base text-gray-400/80">
                                                {{ capitalize(field) }}
                                            </div>
                                            <div class="text-0 text-xl">{{ value }}</div>
                                        </div>
                                        <div>
                                            <div class="text-base text-gray-400/80">
                                                <div>Statut</div>
                                                <div
                                                    class="text-0 text-xl"
                                                    :class="{
                                                        '!text-green-500': shownRequest?.state === APPROVED,
                                                        '!text-red-500': shownRequest?.state === REJECTED,
                                                        '!text-gray-500/90': shownRequest?.state === PENDING,
                                                    }"
                                                >
                                                    {{
                                                        statusNames[shownRequest?.state ?? '']?.[
                                                            $i18n.locale
                                                        ] ?? ''
                                                    }}
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="shownRequest?.state === REJECTED" class="flex flex-col">
                                            <div class="text-lg text-gray-400/80">Raison du refus</div>
                                            <div
                                                class="text-0 text-2xl"
                                                :class="!shownRequest.handledMessage ? 'italic' : ''"
                                            >
                                                {{ shownRequest.handledMessage || 'Pas de raison donnée.' }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="button-cancel mt-10 self-center" @click="close">Fermer</div>
                                </div>
                            </template>
                        </ModalPopup>

                        <div
                            class="flex w-36 cursor-pointer items-center justify-center gap-2 rounded-xl py-1 px-3 text-white"
                            :class="{
                                'bg-green-500 hover:bg-green-600': request.state === APPROVED,
                                'bg-red-500 hover:bg-red-600': request.state === REJECTED,
                                'bg-gray-500/50 hover:bg-gray-600/50': request.state === PENDING,
                            }"
                            @click="
                                () => {
                                    showRequestModal = true
                                    shownRequest = request
                                }
                            "
                        >
                            <template v-if="request.state === APPROVED">
                                <i class="fa fa-check" />
                                <div>{{ statusNames[APPROVED][$i18n.locale] }}</div>
                            </template>
                            <template v-else-if="request.state === REJECTED">
                                <i class="fa fa-xmark" />
                                <div>{{ statusNames[REJECTED][$i18n.locale] }}</div>
                            </template>
                            <template v-else-if="request.state === PENDING">
                                <i class="fa fa-envelope" />
                                <div>{{ statusNames[PENDING][$i18n.locale] }}</div>
                            </template>
                        </div>
                    </div>
                </template>
                <div v-else class="my-6 flex flex-col items-center gap-4">
                    <img class="h-48 w-48" :src="Puzzle" />
                    <div class="text-2 text-lg">Vous n'avez pas de demandes d'adhésion en cours.</div>

                    <router-link class="button-blue mt-4 text-xl" to="/clubs"
                        >Découvrir les associations<i class="fa fa-arrow-right ml-2" />
                    </router-link>
                </div>
            </template>
        </div>
        <ModalPopup :show="showTransferModal" @close="showTransferModal = false">
            <template #default="{ close }">
                <div
                    v-if="currentMembership"
                    class="card flex flex-col items-center justify-center py-8 px-10"
                >
                    <div class="text-2xl font-semibold">
                        Vous vous apprêtez à transmettre votre rôle de
                        {{ clubRoleNames[currentMembership.role][$i18n.locale] }}
                    </div>
                    <div class="text-2 text-sm">En transmettant votre rôle, vous le perdrez vous même.</div>
                    <div
                        v-if="members.filter((memb) => !specialRoles.includes(memb.role)).length > 0"
                        class="mt-4 flex flex-col gap-4"
                    >
                        <div
                            v-for="member of members.filter((memb) => !specialRoles.includes(memb.role))"
                            :key="member"
                            class="flex items-center gap-2"
                        >
                            <ProfileAvatar
                                :avatar="member.user.avatar"
                                :name="fullname(member.user)"
                                :size="2"
                            />
                            <p>{{ fullname(member.user) }}</p>
                            <button class="button-blue" @click="() => transfer(member)">
                                Transmettre le rôle
                            </button>
                        </div>
                    </div>
                    <div v-else>Il n'existe pas de membre auquel vous pouvez transmettre votre rôle</div>
                    <div class="mt-6 flex gap-4 self-end">
                        <div class="button-cancel" @click="close">Annuler</div>
                    </div>
                </div>
            </template>
        </ModalPopup>
    </div>
</template>

<script setup>
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import TipRelativeDate from '@/components/UI/Tip/TipRelativeDate.vue'
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'

    import Puzzle from '@/assets/img/3dicons/puzzle.png'

    import { fullname } from '@/utils/users'

    import { capitalize } from 'lodash'

    import { clubRoleNames, specialRoles } from '@/shared/types/club-roles.enum'
    import { APPROVED, REJECTED, PENDING, statusNames } from '@/shared/types/club-requests.enum'

    import { useClubsStore } from '@/store/clubs.store'
    import { useAuthStore } from '@/store/auth.store'
    import { ref } from 'vue'

    const auth = useAuthStore()
    const clubs = useClubsStore()

    const showRequestModal = ref(false)
    const shownRequest = ref(null)

    const members = ref([])
    const showTransferModal = ref(false)

    const MEMBER = 'active'
    const REQUEST = 'requests'

    const currentTab = ref(null)

    const currentMembership = ref(null)

    const leaveClub = async (membership) => {
        clubs
            .removeMembership(membership.team.teamId, membership.user.id)
            .then(() => clubs.getMembershipsOf(auth.user))
            .catch((err) => {
                console.error(err)
            })
    }

    const transferRole = async (membership) => {
        currentMembership.value = membership
        clubs.getMembershipsOfClub(membership.team.teamId).then((memberships) => {
            members.value = memberships
            showTransferModal.value = true
        })
    }

    const transfer = (member) => {
        showTransferModal.value = false
        const role = currentMembership.value.role
        clubs
            .patchMembership(currentMembership.value.team.teamId, currentMembership.value.user.id, {
                role: 'member',
            })
            .then(() => {
                clubs.getMembershipsOf(auth.user).then((memberships) => {
                    members.value = memberships
                })
            })
        clubs
            .patchMembership(member.team.teamId, member.user.id, {
                role: role,
            })
            .then(() => {
                clubs.getMembershipsOf(auth.user).then((memberships) => {
                    members.value = memberships
                })
            })
    }

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
