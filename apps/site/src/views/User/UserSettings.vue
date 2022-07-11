<template>
    <Transition mode="out-in" name="switch-fade">
        <div class="flex flex-col gap-10 md:flex-row centered-container-padded">
            <div class="flex flex-col gap-4 w-full md:w-auto">
                <div class="flex gap-5 md:flex-col">
                    <div class="relative">
                        <AvatarCropper
                            v-model="editingAvatar"
                            :upload-url="uploadAvatarUrl"
                            :request-options="{ method: 'PUT', credentials: 'include' }"
                            :labels="{ submit: 'Valider', cancel: 'Annuler' }"
                            :cropper-options="{ aspectRatio: 1, zoomable: true, movable: true }"
                            @error="onAvatarUploadFailure"
                            @completed="onAvatarUploadSuccess"
                        />
                        <ProfileAvatar
                            class="hidden lg:block"
                            :avatar="me.avatar"
                            :name="fullname(me)"
                            :size="14"
                        />
                        <ProfileAvatar
                            class="lg:hidden md-max:hidden"
                            :avatar="me.avatar"
                            :name="fullname(me)"
                            :size="12"
                        />
                        <ProfileAvatar class="md:hidden" :avatar="me.avatar" :name="fullname(me)" :size="6" />
                        <button
                            class="flex absolute right-0 bottom-0 justify-center items-center w-12 h-12 text-lg rounded-full border-4 border-2-light dark:border-2-dark !shadow-none cursor-pointer md:text-xl button-grey fa fa-camera"
                            @click="editingAvatar = true"
                        />
                    </div>
                    <div class="flex flex-col">
                        <div class="text-lg font-semibold md:text-xl text-0">{{ fullname(me) }}</div>
                        <div class="text-3">{{ me.userId }}</div>
                    </div>
                </div>
                <div class="flex flex-col md:w-48 lg:w-56 md-max:w-full">
                    <div v-if="editingStatus" class="flex flex-col gap-2 items-end mt-2">
                        <textarea :value="status" rows="4" class="w-full resize-none input" />
                        <div class="flex gap-2">
                            <button
                                class="flex gap-2 items-center py-1 text-sm button-green"
                                @click="submitStatus"
                            >
                                Enregistrer
                            </button>
                            <button
                                class="flex gap-2 items-center py-1 text-sm button-grey"
                                @click="editingStatus = false"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                    <div v-else-if="me.shortDescription" class="break-words text-0">
                        <p class="inline">
                            {{ me.shortDescription }}
                        </p>
                        <button
                            class="inline-flex justify-center items-center p-2 ml-2 w-6 h-6 rounded-full button-blue"
                            @click="editingStatus = true"
                        >
                            <i class="text-xs fa fa-pen" />
                        </button>
                        <!-- <div class="inline whitespace-nowrap break-words">
                            {{ me.shortDescription }}
                        </div>
                        <button
                            class="inline-flex justify-center items-center p-2 w-6 h-6 rounded-full button-blue"
                            @click="editingStatus = true"
                        >
                            <i class="text-xs fa fa-pen" />
                        </button> -->
                    </div>
                    <button
                        v-else
                        class="flex gap-4 justify-center items-center py-1 cursor-pointer button-grey"
                        @click="editingStatus = true"
                    >
                        <i class="text-base md:text-lg fa fa-icons" />Définir un statut
                    </button>
                </div>
            </div>

            <div class="flex flex-col">
                <HorizontalTabs v-model="currentTab" :tabs="tabs" route-base="/me" route-name="me" />
                <div class="flex flex-col">
                    <component :is="currentComponent" />
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
    import AvatarCropper from 'vue-avatar-cropper'

    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import AppSuspense from '../App/AppSuspense.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'

    import SettingsOverview from '@/components/User/Settings/SettingsOverview.vue'
    import SettingsClubs from '@/components/User/Settings/SettingsClubs.vue'
    // import SettingsSocials from '@/components/User/Settings/SettingsSocials.vue'
    import WIP from '@/views/App/WIP.vue'

    import { computed, ref, h } from 'vue'

    import { fullname } from '@/utils/users'

    import { useAuthStore } from '@/store/auth.store'
    import { useUsersStore } from '@/store/users.store'
    import { emitter } from '@/shared/modules/emitter'

    const users = useUsersStore()
    const auth = useAuthStore()
    const me = ref(auth.user)

    const uploadAvatarUrl = `${import.meta.env.VITE_API_URL}/users/avatar`

    const OVERVIEW = 'overview'
    const CLUBS = 'clubs'
    const SOCIALS = 'socials'
    const FAVORITES = 'favorites'

    const tabs = [
        {
            id: OVERVIEW,
            name: 'Général',
            route: '/me',
            icon: 'user',
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
    const editingAvatar = ref(false)
    const status = ref(me.value.shortDescription || '')

    const DEFAULT_TAB = tabs[0]

    const components = {
        [OVERVIEW]: h(AppSuspense, { key: OVERVIEW }, { default: () => h(SettingsOverview) }),
        [CLUBS]: h(AppSuspense, { key: CLUBS }, { default: () => h(SettingsClubs) }),
        [SOCIALS]: h(AppSuspense, { key: SOCIALS }, { default: () => h(WIP) }),
        [FAVORITES]: h(AppSuspense, { key: SOCIALS }, { default: () => h(WIP) }),
    }

    const currentTab = ref(null)
    const currentComponent = computed(() => components[currentTab.value ?? DEFAULT_TAB.id])

    const submitStatus = () => {
        users
            .updateUser(me.value.userId, { shortDescription: document.querySelector('textarea').value })
            .then((data) => {
                status.value = data.shortDescription
                me.value.shortDescription = status
                editingStatus.value = false
                emitter.emit('show-toast', {
                    message: 'Statut mis à jour.',
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

    const onAvatarUploadFailure = (err) => {
        if (!err?.context?.response) {
            emitter.emit('show-toast', {
                message: `Erreur: ${err.message}`,
                type: 'failure',
            })
        }
    }

    const onAvatarUploadSuccess = (avatar) => {
        if (avatar?.response?.status === 200) {
            avatar.response.json().then((user) => {
                auth.updateUser(user)
                me.value = { ...me.value, ...user }
            })

            emitter.emit('show-toast', {
                message: 'Avatar mis à jour.',
                type: 'success',
            })
        } else {
            emitter.emit('show-toast', {
                message: `Erreur: ${avatar?.response?.statusText ?? 'Erreur inconnue'}`,
                type: 'failure',
            })
        }
    }
</script>
