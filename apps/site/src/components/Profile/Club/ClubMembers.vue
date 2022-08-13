<template>
    <div class="flex flex-col gap-2">
        <div
            v-for="membership in club.activeMembers"
            :key="membership.id"
            class="card-2 flex justify-between gap-3"
        >
            <UserActivity :user="membership.user" :subtitle="membership.role">
                <template #title>
                    <div class="text-0 flex gap-2 font-medium">
                        {{ fullname(membership.user) }}
                        <LabelSimple
                            v-if="restrictedRoles.includes(membership.role)"
                            bg-class="bg-green-500 dark:bg-green-700 hover:bg-green-600 dark:hover:bg-green-600"
                        >
                            Bureau Restreint
                        </LabelSimple>
                        <LabelSimple v-else-if="specialRoles.includes(membership.role)">
                            Bureau Étendu
                        </LabelSimple>
                    </div>
                </template>
            </UserActivity>
        </div>

        <!-- <ModalPopup :show="showTransferModal" @close="showTransferModal = false">
            <template #default="{ close }">
                <div
                    v-if="currentMembership"
                    class="card flex flex-col items-center justify-center py-8 px-10"
                >
                    <div class="text-2xl font-semibold">
                        Vous vous apprêtez à transmettre votre rôle de
                        {{ clubRoleNames[currentMembership.role][locale] }}
                    </div>
                    <div class="text-2 text-sm">En transmettant votre rôle, vous le perdrez vous même.</div>
                    <div
                        v-if="memberships.filter((memb) => !specialRoles.includes(memb.role)).length > 0"
                        class="mt-4 flex flex-col gap-4"
                    >
                        <div
                            v-for="member of memberships.filter((memb) => !specialRoles.includes(memb.role))"
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
                    <div class="mt-6 flex self-end">
                        <button class="button-grey" @click="close">Annuler</button>
                    </div>
                </div>
            </template>
        </ModalPopup> -->
    </div>
</template>

<script setup>
    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'
    // import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import { fullname } from '@/utils/users'
    // import { clubRoleNames } from '@/shared/types/club-roles.enum'
    import { restrictedRoles, specialRoles } from '@/shared/types/club-roles.enum'

    // import { ref } from 'vue'
    // import { useAuthStore } from '@/store/auth.store'
    // import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'

    // import { useI18n } from 'vue-i18n'
    import UserActivity from '@/components/App/General/UserActivity.vue'

    // const { locale } = useI18n({ useScope: 'global' })

    // const clubs = useClubsStore()
    // const auth = useAuthStore()

    // const showTransferModal = ref(false)
    // const currentMembership = ref(null)

    defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

    // const transferRole = async (membership) => {
    //     currentMembership.value = membership
    //     showTransferModal.value = true
    // }

    // const transfer = (member) => {
    //     showTransferModal.value = false
    //     const role = currentMembership.value.role
    //     clubs
    //         .patchMembership(currentMembership.value.team.id, currentMembership.value.user.id, {
    //             role: 'member',
    //         })
    //         .then(() => {
    //             loadMemberships()
    //         })
    //     clubs
    //         .patchMembership(member.team.id, member.user.id, {
    //             role: role,
    //         })
    //         .then(() => {
    //             loadMemberships()
    //         })
    // }

    // const patchRole = async (membership) => {
    //     await clubs
    //         .patchMembership(membership.team.id, membership.user.id, { role: membership.role })
    //         .then(async () => {
    //             await loadMemberships()
    //         })
    //     // .catch((err) => console.log(err))
    // }

    // const clubId = ref(parseInt(props.club.id))
    // const memberships = ref([])

    // const loadMemberships = async () => {
    //     await clubs.getMembershipsOfClub(clubId.value).then((members) => {
    //         memberships.value = members
    //     })
    // }

    // await loadMemberships()

    // watch(
    //     () => props.club.id,
    //     async () => {
    //         clubId.value = props.club.id
    //         await loadMemberships()
    //     },
    // )
</script>
