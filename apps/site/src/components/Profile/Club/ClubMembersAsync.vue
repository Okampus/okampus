<template>
    <div class="flex flex-col gap-2">
        <div
            v-for="membership in memberships"
            :key="membership.teamMemberId"
            class="flex gap-3 justify-between card-2"
        >
            <div class="flex gap-3">
                <ProfileAvatar :avatar="membership.user.avatar" :name="fullname(membership.user)" />
                <div>{{ fullname(membership.user) }}</div>
                <div>
                    ({{ membership.roleLabel ?? clubRoleNames[membership.role]?.[$i18n.locale] ?? '' }})
                </div>
            </div>

            <div class="flex gap-4 items-center">
                <button
                    v-if="auth.user.userId === membership.user.userId"
                    class="py-1 font-semibold rounded-full button-red"
                    @click="transferRole(membership)"
                >
                    Transmettre le rôle de {{ clubRoleNames[membership.role].fr }}
                </button>

                <SelectInput
                    v-else
                    v-model="membership.role"
                    :max-content-width="1"
                    :choices="Object.keys(clubRoleNames).map((role) => clubRoleNames[role].fr)"
                    :values="Object.keys(clubRoleNames)"
                    @update:model-value="() => patchRole(membership)"
                />

                <router-link
                    v-if="!memberRole"
                    :to="`/user/${membership.user.userId}`"
                    class="py-1 font-semibold rounded-full button-blue"
                >
                    Profil
                </router-link>
            </div>
        </div>

        <ModalPopup :show="showTransferModal" @close="showTransferModal = false">
            <template #default="{ close }">
                <div
                    v-if="currentMembership"
                    class="flex flex-col justify-center items-center py-8 px-10 card"
                >
                    <div class="text-2xl font-semibold">
                        Vous vous apprêtez à transmettre votre rôle de
                        {{ clubRoleNames[currentMembership.role][$i18n.locale] }}
                    </div>
                    <div class="text-sm text-2">En transmettant votre rôle, vous le perdrez vous même.</div>
                    <div
                        v-if="memberships.filter((memb) => !specialRoles.includes(memb.role)).length > 0"
                        class="flex flex-col gap-4 mt-4"
                    >
                        <div
                            v-for="member of memberships.filter((memb) => !specialRoles.includes(memb.role))"
                            :key="member"
                            class="flex gap-2 items-center"
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
                    <div class="flex self-end mt-6">
                        <div class="button-grey" @click="close">Annuler</div>
                    </div>
                </div>
            </template>
        </ModalPopup>
    </div>
</template>

<script setup>
    import ProfileAvatar from '../ProfileAvatar.vue'
    import SelectInput from '@/components/Input/SelectInput.vue'

    import { fullname } from '@/utils/users'
    import { clubRoleNames } from '@/shared/types/club-roles.enum'
    import { specialRoles } from '@/shared/types/club-roles.enum'

    import { useClubsStore } from '@/store/clubs.store'
    import { ref, watch } from 'vue'
    import { useAuthStore } from '@/store/auth.store'
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'

    const clubs = useClubsStore()
    const auth = useAuthStore()

    const showTransferModal = ref(false)
    const currentMembership = ref(null)

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    const transferRole = async (membership) => {
        currentMembership.value = membership
        showTransferModal.value = true
    }

    const transfer = (member) => {
        showTransferModal.value = false
        const role = currentMembership.value.role
        clubs
            .patchMembership(currentMembership.value.team.teamId, currentMembership.value.user.userId, {
                role: 'member',
            })
            .then(() => {
                loadMemberships()
            })
        clubs
            .patchMembership(member.team.teamId, member.user.userId, {
                role: role,
            })
            .then(() => {
                loadMemberships()
            })
    }

    const patchRole = async (membership) => {
        await clubs
            .patchMembership(membership.team.teamId, membership.user.userId, { role: membership.role })
            .then(async () => {
                await loadMemberships()
            })
            .catch((err) => console.log(err))
    }

    const clubId = ref(parseInt(props.club.teamId))
    const memberships = ref([])

    const loadMemberships = async () => {
        await clubs.getMembershipsOfClub(clubId.value).then((members) => {
            memberships.value = members
        })
    }

    await loadMemberships()

    watch(
        () => props.club.teamId,
        async () => {
            clubId.value = props.club.teamId
            await loadMemberships()
        },
    )
</script>
