<template>
    <GraphQLQuery
        :query="getClub"
        :variables="{ id: parseInt(route.params.clubId) }"
        :update="(data) => data?.clubById"
    >
        <template #default="{ data: club }">
            <FormPopUp
                v-model:show="showJoinForm"
                :submit="
                    (form) =>
                        join({
                            id: club?.id,
                            request: {
                                role: form.role ?? MEMBER,
                                originalFormId: club?.membershipRequestForm?.id,
                                formSubmission: form,
                            },
                        })
                "
                :submit-button="{
                    icon: 'envelope',
                    label: 'Rejoindre',
                }"
                :form-schema="club?.formSchema ?? DEFAULT_JOIN_FORM_SCHEMA"
                :form-data="{ club }"
            />
            <ProfileBanner
                :name="club.name"
                :banner="club.banner"
                :data="club.category"
                class="h-40 p-0"
                :rounded-top="false"
            />
            <div class="text-0 bg-2 flex flex-col gap-6 pt-4">
                <div class="centered-container-padded mb-0 flex items-start justify-between gap-4 py-0">
                    <div class="-mt-[5rem] flex gap-4">
                        <ProfileAvatar
                            :avatar="club.avatar"
                            :size="9"
                            :name="club.name"
                            inner-class="border-4 border-white dark:border-black !sahdow-none"
                        />
                        <div class="mt-[5.1rem] flex flex-col">
                            <div class="flex items-center gap-3">
                                <p class="text-3xl font-semibold">{{ club.name }}</p>

                                <router-link :to="`/clubs/${clubTypes[club.category].link}`">
                                    <LabelSimple class="bg-slate-600/40 hover:bg-slate-400/40">{{
                                        club.category
                                    }}</LabelSimple>
                                </router-link>
                            </div>
                            <p class="text-2 text-lg">{{ club.shortDescription }}</p>
                        </div>
                    </div>

                    <button
                        v-if="
                            club.userMembership.membership?.role &&
                            specialRoles.includes(club.userMembership.membership?.role)
                        "
                        class="button-green pill-button -ml-1"
                        @click="router.push(`/club/${club.id}/manage`)"
                    >
                        <i class="fa fa-gear" />
                        <div>Gérer</div>
                    </button>
                    <button
                        v-else-if="club.userMembership.membership?.role"
                        class="button-indigo pill-button -ml-1"
                        @click="router.push(`/club/${club.id}`)"
                    >
                        <i class="fa fa-users" />
                        <div>Profil</div>
                    </button>
                    <button
                        v-else-if="club.userMembership.pendingRequest"
                        class="button-grey pill-button -ml-1"
                        @click="router.push(`/me/clubs/requests`)"
                    >
                        <i class="fa fa-envelope" />
                        <div>En attente</div>
                    </button>
                    <button
                        v-else
                        class="button-blue -ml-1 rounded-full py-1 text-center font-semibold"
                        @click="showJoinForm = true"
                    >
                        Rejoindre
                    </button>
                </div>

                <div class="centered-container-padded py-0">
                    <HorizontalTabs
                        v-model="currentTab"
                        :tabs="tabs"
                        :route-base="clubRoute"
                        route-name="club"
                    />
                </div>
            </div>

            <div class="centered-container py-4">
                <component :is="currentComponent" :club="club" class="w-full" />
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ProfileBanner from '@/components/Profile/ProfileBanner.vue'
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'

    import ClubHomepage from '@/components/Profile/Club/ClubHomepage.vue'
    import ClubDocuments from '@/components/Profile/Club/ClubDocuments.vue'
    import ClubActivity from '@/components/Profile/Club/ClubActivity.vue'
    import ClubMembers from '@/components/Profile/Club/ClubMembers.vue'

    import LabelSimple from '@/components/UI/Label/LabelSimple.vue'
    import FormPopUp from '@/components/Form/FormPopUp.vue'

    import { computed, ref } from 'vue'

    import { useRoute, useRouter } from 'vue-router'

    import { specialRoles } from '@/shared/types/club-roles.enum'
    import { clubTypes } from '@/shared/types/club-types.enum'

    import { getClub } from '@/graphql/queries/teams/getClub.js'

    import { joinTeam } from '@/graphql/queries/teams/joinTeam.js'
    import { useMutation } from '@vue/apollo-composable'
    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast.js'

    import { DEFAULT_JOIN_FORM_SCHEMA } from '@/shared/assets/form-schemas/default-schemas.js'

    const { mutate: join, onDone, onError } = useMutation(joinTeam)

    onDone(() => {
        showJoinForm.value = false
        showSuccessToast('Votre demande a bien été envoyée ✉️')
    })

    onError(showToastGraphQLError)

    const route = useRoute()
    const router = useRouter()

    const HOME = 'home'
    const MEMBERS = 'members'
    const DOCUMENTS = 'drive'
    const ACTIVITY = 'activity'

    const clubRoute = computed(() => `/club/${route.params.clubId}`)

    const currentTab = ref(null)
    const tabs = [
        {
            id: HOME,
            name: 'Accueil',
            route: clubRoute,
            icon: 'house',
        },
        {
            id: MEMBERS,
            name: 'Membres',
            icon: 'users',
        },
        {
            id: ACTIVITY,
            name: 'Évents',
            icon: 'calendar',
        },
        {
            id: DOCUMENTS,
            name: 'Documents',
            icon: 'file-arrow-down',
        },
    ]

    const DEFAULT_TAB = tabs[0]

    const components = {
        [HOME]: ClubHomepage,
        [DOCUMENTS]: ClubDocuments,
        [MEMBERS]: ClubMembers,
        [ACTIVITY]: ClubActivity,
    }

    const currentComponent = computed(() => components[currentTab.value ?? DEFAULT_TAB.id])

    const showJoinForm = ref(false)
</script>
