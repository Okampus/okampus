<template>
    <div class="flex gap-4 my-8 centered-container">
        <VerticalTabs
            v-model="currentTab"
            :tabs="tabs"
            route-base="/clubs"
            route-name="clubs"
            class="sticky top-8"
        />

        <div v-if="currentClubs.length === 0" class="w-full text-center text-0">
            <EmojiSad class="mb-3 text-3xl" />
            <div class="text-2xl font-bold">Aucune association ne correspond à ces critères.</div>
            <div class="text-lg">
                Essayez la
                <router-link to="/clubs" class="link-blue">liste de toutes les associations</router-link>.
            </div>
        </div>

        <div v-else class="flex flex-wrap gap-4 w-fit h-fit">
            <ModalPopup
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
                        <div class="flex gap-4 self-end mt-6">
                            <div class="button-cancel" @click="close">Annuler</div>
                            <div
                                class="flex gap-2 items-center button-submit with-shadow"
                                @click="joinForm.node.submit()"
                            >
                                <i class="text-lg fa fa-envelope" />
                                <div>Envoyer ma demande</div>
                            </div>
                        </div>
                    </div>
                </template>
            </ModalPopup>

            <ClubCard
                v-for="club in currentClubs"
                :key="club.teamId"
                :club="club"
                @request="
                    (clubId) => {
                        showJoinForm = true
                        joiningClubId = clubId
                    }
                "
            />
        </div>
    </div>
</template>

<script setup>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import VerticalTabs from '@/components/UI/Tabs/VerticalTabs.vue'
    import ClubCard from '@/components/App/ListCard/ClubCard.vue'
    import EmojiSad from '@/icons/Emoji/EmojiSad.vue'

    import { clubTypes, linkToClubType } from '@/shared/types/club-types.enum'

    import { computed, ref } from 'vue'

    import { emitter } from '@/shared/modules/emitter'
    import { i18n } from '@/shared/modules/i18n'

    import { getStatusAxiosError } from '@/utils/errors'

    import { useAuthStore } from '@/store/auth.store'
    import { useClubsStore } from '@/store/clubs.store'
    import { groupBy } from 'lodash'
    import {
        clubRoleNames,
        specialRoles,
        IS_WAITING,
        IS_MEMBER,
        IS_SPECIAL_ROLE,
    } from '@/shared/types/club-roles.enum'

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

    const roles = Object.entries(clubRoleNames).map(([value, name]) => ({
        value,
        label: name[i18n.global.locale],
    }))

    const ALL = 0
    const ALL_LABEL = 'all'
    const MY_CLUBS = 1
    const MY_CLUBS_LABEL = 'my-clubs'

    const CATEGORIES = 1

    const clubList = ref([])
    const clubListByCategory = ref({})
    const categories = ref([])

    const showJoinForm = ref(false)

    const joinForm = ref(null)
    const joinFormData = ref({})
    const joiningClubId = ref(null)
    const joiningClub = computed(
        () => clubList.value.find((club) => club.teamId === joiningClubId.value) ?? { name: '' },
    )

    const joinFormSubmit = async (data) => {
        const { role, ...meta } = data

        await clubs
            .postMembershipRequest(joiningClubId.value, { role, meta })
            .then(() => {
                clubList.value.find((club) => club.teamId === joiningClubId.value).membership = IS_WAITING
                emitter.emit('show-toast', {
                    message: "Votre demande d'adhésion a bien été envoyée !",
                    type: 'success',
                })
            })
            .catch((err) => {
                emitter.emit('show-toast', {
                    message: `Erreur: ${err.message}`,
                    type: 'error',
                })
            })
    }

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
                console.log('Jambon', err)
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
                console.log('odk', err)
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
                console.log('ok', err)
                emitter.emit('error-route', { code: getStatusAxiosError(err) })
            })
    }

    await loadClubList()
    await Promise.all([getMemberships(), getRequests()])
</script>
