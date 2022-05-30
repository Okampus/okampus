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

            <router-link
                v-if="!memberRole"
                :to="`/user/${membership.user.userId}`"
                class="py-2 px-3 -ml-1 w-fit text-xl font-semibold text-center text-white bg-blue-600 hover:bg-blue-700 rounded-full"
            >
                Profil
            </router-link>
        </div>
    </div>
</template>

<script setup>
    import ProfileAvatar from '../ProfileAvatar.vue'

    import { fullname } from '@/utils/users'
    import { clubRoleNames } from '@/shared/types/club-roles.enum'

    import { useClubsStore } from '@/store/clubs.store'
    import { ref, watch } from 'vue'

    const clubs = useClubsStore()

    const props = defineProps({
        club: {
            type: Object,
            required: true,
        },
    })

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
