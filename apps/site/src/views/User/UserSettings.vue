<template>
    <Transition mode="out-in" name="switch-fade">
        <div class="centered-container padded flex flex-col gap-10 md:flex-row">
            <div class="sticky top-8 flex h-fit w-full flex-col gap-4 md:w-auto">
                <div class="flex gap-5 md:flex-col">
                    <ProfileAvatar :avatar="me.avatar" :name="fullname(me)" :size="md ? (lg ? 14 : 12) : 6">
                        <template #icon>
                            <div v-if="me.avatar" class="absolute right-0 bottom-0">
                                <ModalDropdown :buttons="avatarButtons">
                                    <button class="button-circle fa fa-camera" />
                                </ModalDropdown>
                            </div>
                            <button
                                v-else
                                class="button-circle fa fa-camera absolute right-0 bottom-0"
                                @click="editingAvatar = true"
                            />
                        </template>
                    </ProfileAvatar>
                    <div class="flex flex-col">
                        <div class="text-0 text-lg font-semibold md:text-xl">{{ fullname(me) }}</div>
                        <div class="text-3">{{ me.id }}</div>
                    </div>
                </div>
                <div class="flex flex-col md:w-48 lg:w-56 md-max:w-full">
                    <EditableTextInput
                        v-if="me.shortDescription || editingStatus"
                        v-model:show-input="editingStatus"
                        v-model="status"
                        :max-char="128"
                        max-char-message="Votre statut ne peut pas dépasser 128 caractères"
                        placeholder="Votre statut"
                        @validate="submitStatus"
                    />
                    <button
                        v-else
                        class="button-grey flex cursor-pointer items-center justify-center gap-4 py-1"
                        @click="editingStatus = true"
                    >
                        <i class="fa fa-icons text-base md:text-lg" />Définir un statut
                    </button>
                </div>
            </div>

            <div class="flex w-full flex-col">
                <HorizontalTabs v-model="currentTab" :tabs="tabs" route-base="/me" route-name="me" />
                <div class="flex w-full flex-col">
                    <component :is="currentComponent" />
                </div>
            </div>
            <AvatarCropper
                v-model="editingAvatar"
                :upload-url="uploadAvatarUrl"
                :request-options="{
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'X-Tenant-Id': getTenant() },
                }"
                :labels="{ submit: 'Valider', cancel: 'Annuler' }"
                :cropper-options="{ aspectRatio: 1, zoomable: true, movable: true }"
                @error="onAvatarUploadFailure"
                @completed="onAvatarUploadSuccess"
            />
        </div>
    </Transition>
</template>

<script setup>
    import AvatarCropper from 'vue-avatar-cropper'

    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'
    import AppSuspense from '@/views/App/AppSuspense.vue'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import EditableTextInput from '@/components/Input/EditableTextInput.vue'

    import SettingsOverview from '@/components/User/Settings/SettingsOverview.vue'
    import SettingsClubs from '@/components/User/Settings/SettingsClubs.vue'
    import ModalDropdown from '@/components/UI/Modal/ModalDropdown.vue'
    // import SettingsSocials from '@/components/User/Settings/SettingsSocials.vue'
    import WIP from '@/views/App/WIP.vue'

    import { computed, ref, h } from 'vue'

    import { getTenant } from '@/utils/getTenant'

    import { fullname } from '@/utils/users'

    import { useAuthStore } from '@/store/auth.store'
    import { useUsersStore } from '@/store/users.store'
    import { emitter } from '@/shared/modules/emitter'
    import { useBreakpoints } from '@vueuse/core'
    import { twBreakpoints } from '@/tailwind'

    const breakpoints = useBreakpoints(twBreakpoints)
    const md = breakpoints.greater('md')
    const lg = breakpoints.greater('lg')

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
            .updateUser(me.value.id, { shortDescription: document.querySelector('textarea').value })
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

    const avatarButtons = [
        {
            name: "Changer d'avatar",
            icon: 'fas fa-camera',
            class: 'hover:bg-blue-300 dark:hover:bg-blue-500',
            action: () => {
                editingAvatar.value = true
            },
        },
        {
            name: 'Supprimer mon avatar',
            icon: 'fas fa-xmark',
            class: 'hover:bg-red-300 dark:hover:bg-red-500',
            action: () => {
                users.updateUser(me.value.id, { avatar: null })
                auth.updateUser({ ...me.value, avatar: null })
                me.value = { ...me.value, avatar: null }
            },
        },
    ]

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
                message: 'Avatar mis à jour 🎉',
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
