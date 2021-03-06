<template>
    <div>
        <div class="bg-1 sticky top-0 z-50 px-2 md:hidden">
            <HorizontalTabs v-model="currentTab" :tabs="tabs" route-base="/clubs" route-name="clubs" />
        </div>
        <div class="centered-container-padded flex flex-col gap-4 md:flex-row">
            <VerticalTabs
                v-model="currentTab"
                :tabs="tabs"
                route-base="/clubs"
                route-name="clubs"
                class="sticky top-8 hidden md:block"
            />
            <div v-if="currentClubs.length === 0" class="text-0 w-full text-center">
                <EmojiSad class="mb-3 text-3xl" />
                <div class="text-2xl font-bold">Aucune association ne correspond à ces critères.</div>
                <div class="text-lg">
                    Essayez la
                    <router-link to="/clubs" class="link-blue">liste de toutes les associations</router-link>.
                </div>
            </div>
            <div v-else class="flex h-fit w-full flex-wrap gap-4">
                <ClubJoinForm
                    v-model:show="showJoinForm"
                    :club="joiningClub"
                    @closed="joiningClubId = null"
                    @submitted="
                        () =>
                            (clubList.value.find((club) => club.teamId === joiningClubId.value).membership =
                                IS_WAITING)
                    "
                />
                <!-- <ModalPopup
                    :show="showJoinForm"
                    @close="showJoinForm = false"
                    @closed="
                        () => {
                            joiningClubId = null
                            joinFormData = {}
                        }
                    "
                >
                    <template #default="{ close }">
                        <div class="flex flex-col justify-center items-center py-8 px-10 card">
                            <div class="text-2xl font-semibold">
                                Vous vous apprêtez à rejoindre {{ joiningClub.name }} !
                            </div>
                            <div class="text-sm text-2">
                                Mais d'abord, donnez du contexte sur votre demande d'adhésion.
                            </div>
                            <FormKit
                                id="join-club"
                                ref="joinForm"
                                v-model="joinFormData"
                                type="form"
                                form-class="flex flex-col mt-6 max-w-lg"
                                :actions="false"
                                @submit="
                                    (data) => {
                                        joinFormSubmit(data)
                                        close()
                                    }
                                "
                            >
                                <FormKit
                                    label="Votre rôle souhaité"
                                    type="radio"
                                    name="role"
                                    :validation="[['required']]"
                                    help="Quel rôle souhaitez-vous obtenir ?"
                                    :options="roles"
                                />
                                <FormKit
                                    type="text"
                                    name="discord"
                                    label="Votre ID Discord (avec le #)"
                                    :validation="[
                                        ['required'],
                                        [
                                            'matches',
                                            /^(?!(here|everyone))^(?!.*(discord|```)).[^\@\#\:]{2,32}#\d{4}$/s,
                                        ],
                                    ]"
                                    :validation-messages="{
                                        matches: 'ID Discord invalide.',
                                    }"
                                    help="ex. Jérôme#4555, Arno#1234..."
                                />
                                <FormKit
                                    type="text"
                                    name="raison"
                                    label="La raison de votre adhésion"
                                    help="Décrivez en quelques mots la raison de votre adhésion."
                                />
                            </FormKit>
                            <FormKitRenderer :schema="schema"></FormKitRenderer>
                            <div class="flex gap-4 self-end mt-6">
                                <button class="button-red" @click="close">Annuler</button>
                                <button
                                    class="flex gap-2 items-center button-blue"
                                    @click="joinForm.node.submit()"
                                >
                                    <i class="text-lg fa fa-envelope" />
                                    <div>Envoyer ma demande</div>
                                </button>
                            </div>
                        </div>
                    </template>
                </ModalPopup> -->
                <ClubCard
                    v-for="club in currentClubs"
                    :key="club.teamId"
                    :club="club"
                    @request="
                        (clubId) => {
                            // loadSchema(club.teamId)
                            showJoinForm = true
                            joiningClubId = clubId
                        }
                    "
                />
            </div>
        </div>
    </div>
</template>

<script setup>
    import VerticalTabs from '@/components/UI/Tabs/VerticalTabs.vue'
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import ClubCard from '@/components/App/ListCard/ClubCard.vue'
    import ClubJoinForm from '@/components/Club/ClubJoinForm.vue'
    import EmojiSad from '@/icons/Emoji/EmojiSad.vue'

    import { clubTypes, linkToClubType } from '@/shared/types/club-types.enum'

    import { computed, ref } from 'vue'

    import { emitter } from '@/shared/modules/emitter'

    import { getStatusAxiosError } from '@/utils/errors'

    import { useAuthStore } from '@/store/auth.store'
    import { useClubsStore } from '@/store/clubs.store'
    import { groupBy } from 'lodash'
    import { specialRoles, IS_WAITING, IS_MEMBER, IS_SPECIAL_ROLE } from '@/shared/types/club-roles.enum'

    const auth = useAuthStore()
    const clubs = useClubsStore()

    const currentTab = ref(null)
    const tabs = [
        {
            id: 'all',
            title: 'Les assos',
            tabs: [
                {
                    id: 'all',
                    route: '/clubs',
                    name: 'Toutes les assos',
                },
                {
                    id: 'my-clubs',
                    name: 'Mes associations',
                },
            ],
        },
        {
            id: 'categories',
            title: 'Catégories',
            tabs: [],
        },
    ]

    const ALL = 0
    const ALL_LABEL = 'all'
    const MY_CLUBS = 1
    const MY_CLUBS_LABEL = 'my-clubs'

    const CATEGORIES = 1

    const clubList = ref([])
    const clubListByCategory = ref({})
    const categories = ref([])
    // const schema = ref([])

    const showJoinForm = ref(false)

    // const joinForm = ref(null)
    // const joinFormData = ref({})
    const joiningClubId = ref(null)
    const joiningClub = computed(
        () => clubList.value.find((club) => club.teamId === joiningClubId.value) ?? { name: '' },
    )

    const currentClubs = computed(() =>
        currentTab.value === ALL_LABEL
            ? clubList.value
            : currentTab.value === MY_CLUBS_LABEL
            ? clubList.value.filter((club) => !!club.membership && club.membership !== IS_WAITING)
            : categories.value.includes(linkToClubType[currentTab.value])
            ? clubListByCategory.value[linkToClubType[currentTab.value]]
            : [],
    )

    const loadClubList = async () => {
        await clubs
            .getClubs()
            .then((res) => {
                clubList.value = res
                clubListByCategory.value = groupBy(res, 'category')

                tabs[ALL].tabs[ALL].amount = res.length

                categories.value = Object.keys(clubListByCategory.value)
                tabs[CATEGORIES].tabs = Object.entries(clubListByCategory.value).map((category) => ({
                    id: clubTypes[category[0]].link,
                    name: category[0],
                    amount: category[1].length,
                }))
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatusAxiosError(err) })
            })
    }

    const getMemberships = async () => {
        await clubs
            .getMembershipsOf(auth.user)
            .then((memberships) => {
                memberships.forEach((membership) => {
                    clubList.value.find((club) => club.teamId === membership.team.teamId).membership =
                        specialRoles.includes(membership.role) ? IS_SPECIAL_ROLE : IS_MEMBER
                })
                tabs[ALL].tabs[MY_CLUBS].amount = clubList.value.filter(
                    (club) => !!club.membership && club.membership !== IS_WAITING,
                ).length
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatusAxiosError(err) })
            })
    }

    const PENDING_STATE = 'pending'
    const getRequests = async () => {
        await clubs
            .getMembershipRequestsOf(auth.user)
            .then((requests) => {
                requests
                    .filter((request) => request.state === PENDING_STATE)
                    .forEach((request) => {
                        clubList.value.find((club) => club.teamId === request.team.teamId).membership =
                            IS_WAITING
                    })
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatusAxiosError(err) })
            })
    }

    // const loadSchema = async (clubId) => {
    //     clubs.getClub(clubId).then((club) => {
    //         schema.value = club?.membershipRequestForm.form ?? null
    //     })
    // }

    await loadClubList()
    await Promise.all([getMemberships(), getRequests()])
</script>
