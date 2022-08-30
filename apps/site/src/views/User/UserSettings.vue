<template>
    <Transition mode="out-in" name="switch-fade">
        <div
            class="relative flex flex-col md:flex-row"
            :class="md ? 'gap-10 centered-container padded' : 'gap-8'"
        >
            <div
                class="bg-1 sticky top-0 z-20 flex h-fit w-full flex-col gap-4 md:top-8 md:w-auto md-max:py-6"
                :class="md ? '' : 'centered-container padded'"
            >
                <div class="flex gap-5 md:flex-col">
                    <ModifiableAvatar
                        :entity="localStore.me"
                        entity-type="user"
                        :size="md ? (lg ? 14 : 12) : 6"
                    />
                    <div class="flex flex-col">
                        <div class="text-0 text-lg font-semibold md:text-xl">
                            {{ fullname(localStore.me) }}
                        </div>
                        <div class="text-3">{{ localStore.me?.id }}</div>
                    </div>
                </div>

                <div class="flex flex-col md:w-48 lg:w-56 md-max:w-full">
                    <EditableTextInput
                        v-if="localStore.me?.shortDescription || editingStatus"
                        v-model:show-input="editingStatus"
                        v-model="status"
                        :max-char="128"
                        max-char-message="Votre statut ne peut pas dépasser 128 caractères"
                        placeholder="Votre statut"
                        @validate="
                            updateUserMutation({ id: localStore.me.id, user: { shortDescription: $event } })
                        "
                    />
                    <button
                        v-else
                        class="button-grey pill-button flex cursor-pointer items-center justify-center"
                        @click="editingStatus = true"
                    >
                        <i class="fa fa-icons text-base md:text-lg" />Définir un statut
                    </button>
                </div>
            </div>

            <div class="relative flex w-full flex-col" :class="md ? '' : 'centered-container padded !pt-0'">
                <HorizontalTabs
                    v-model="currentTab"
                    :tabs="tabs"
                    route-base="/me"
                    route-name="me"
                    class="sticky top-0"
                />
                <div class="flex w-full flex-col">
                    <component :is="currentComponent" />
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
    import ModifiableAvatar from '@/components/Profile/ModifiableAvatar.vue'
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import EditableTextInput from '@/components/Input/EditableTextInput.vue'
    import SettingsOverview from '@/components/User/Settings/SettingsOverview.vue'
    import SettingsClubs from '@/components/User/Settings/SettingsClubs.vue'

    import WIP from '@/views/App/WIP.vue'

    import { computed, ref } from 'vue'

    import { fullname } from '@/utils/users'

    import { useBreakpoints } from '@vueuse/core'
    import { twBreakpoints } from '@/tailwind'

    import { showErrorToast, showSuccessToast } from '@/utils/toast'

    import localStore from '@/store/local.store'
    import { useMutation } from '@vue/apollo-composable'
    import { updateUser } from '@/graphql/queries/users/updateUser'

    const breakpoints = useBreakpoints(twBreakpoints)
    const md = breakpoints.greater('md')
    const lg = breakpoints.greater('lg')

    const OVERVIEW = 'overview'
    const CLUBS = 'clubs'
    const SOCIALS = 'socials'
    const FAVORITES = 'favorites'

    const tabs = [
        {
            id: OVERVIEW,
            name: 'Général',
            route: '/me',
            icon: 'book-bookmark',
        },
        {
            id: CLUBS,
            name: 'Mes assos',
            icon: 'users',
        },
        {
            id: FAVORITES,
            name: 'Mes favoris',
            icon: 'star',
        },
        {
            id: SOCIALS,
            name: 'Mes réseaux',
            icon: 'mail-bulk',
        },
    ]

    const editingStatus = ref(false)
    const status = ref(localStore.value.me?.shortDescription || '')

    const DEFAULT_TAB = tabs[0]

    const components = {
        [OVERVIEW]: SettingsOverview,
        [CLUBS]: SettingsClubs,
        [SOCIALS]: WIP,
        [FAVORITES]: WIP,
    }

    const currentTab = ref(null)
    const currentComponent = computed(() => components[currentTab.value ?? DEFAULT_TAB.id])

    const { mutate: updateUserMutation, onDone: onDoneUser, onError: onErrorUser } = useMutation(updateUser)
    onDoneUser(({ data }) => {
        showSuccessToast('Statut mis à jour 🧭')
        localStore.value.me = { ...localStore.value.me, ...data.updateUser }
    })
    onErrorUser(() => showErrorToast('Échec de la modification du statut !'))
</script>
