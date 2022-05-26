<template>
    <Transition mode="out-in" name="switch-fade">
        <div class="flex gap-6 m-6 max-w-7xl md:gap-10 xl:mx-auto">
            <div class="flex flex-col shrink-0 gap-4 w-[14rem] text-0">
                <div class="relative">
                    <AvatarCropper
                        v-model="editingAvatar"
                        :upload-url="uploadAvatarUrl"
                        :request-options="{ method: 'PUT', credentials: 'include' }"
                        upload-file-name="image.png"
                        @error="onAvatarUploadFailure"
                        @completed="onAvatarUploadSuccess"
                    />
                    <ProfileAvatar :avatar="me.avatar" :name="fullname(me)" :size="14" />

                    <i
                        class="flex absolute right-0 bottom-0 justify-center items-center w-12 h-12 text-xl rounded-full border-4 border-2-light dark:border-2-dark cursor-pointer button-grey fa fa-camera"
                        @click="editingAvatar = true"
                    />
                </div>
                <div class="flex flex-col flex-1">
                    <div class="text-xl font-semibold">{{ fullname(me) }}</div>
                    <div class="text-3">{{ me.userId }}</div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="text-lg font-semibold text-1">Statut</div>
                    <div v-if="editingStatus" class="flex flex-col gap-2">
                        <textarea :value="status" rows="4" class="resize-none input" />
                        <div class="flex gap-2">
                            <div
                                class="flex gap-2 items-center py-2 px-3 text-sm text-white bg-green-500 dark:bg-green-700 rounded-lg cursor-pointer"
                                @click="submitStatus"
                            >
                                Enregistrer
                            </div>
                            <div
                                class="flex gap-2 items-center py-2 px-3 text-sm bg-gray-200 dark:bg-slate-700 rounded-lg cursor-pointer text-0 dark:"
                                @click="editingStatus = false"
                            >
                                Annuler
                            </div>
                        </div>
                    </div>
                    <div v-else-if="me.shortDescription">
                        {{ me.shortDescription
                        }}<i
                            class="p-2 ml-2 hover:bg-gray-500 rounded-xl cursor-pointer fa fa-pen"
                            @click="editingStatus = true"
                        />
                    </div>
                    <div
                        v-else
                        class="flex gap-4 justify-center items-center py-1 rounded-full cursor-pointer button-grey with-shadow"
                        @click="editingStatus = true"
                    >
                        <i class="text-lg fa fa-icons" />Définir un statut
                    </div>
                </div>
            </div>
            <div class="flex flex-col grow">
                <HorizontalTabs
                    v-model="currentTab"
                    class="ml-10"
                    :tabs="tabs"
                    route-base="/me"
                    route-name="me"
                />
                <hr class="self-center w-[calc(100%-3rem)] h-[1px] bg-gray-500/20 border-none" />
                <div class="flex flex-col grow">
                    <div class="grow justify-center items-stretch mt-6">
                        <keep-alive>
                            <component :is="currentComponent" />
                        </keep-alive>
                    </div>
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

    import SettingsClubs from '@/components/User/Settings/SettingsClubs.vue'
    import SettingsSocials from '@/components/User/Settings/SettingsSocials.vue'

    import { computed, ref, h } from 'vue'

    import { fullname } from '@/utils/users'

    import { useAuthStore } from '@/store/auth.store'
    import { useUsersStore } from '@/store/users.store'
    import { emitter } from '@/shared/modules/emitter'

    const users = useUsersStore()
    const auth = useAuthStore()
    const me = ref(auth.user)

    const uploadAvatarUrl = `${import.meta.env.VITE_API_URL}/users/avatar`

    const CLUBS = 'clubs'
    const SOCIALS = 'socials'

    const tabs = [
        {
            id: CLUBS,
            name: 'Mes associations',
            icon: 'user',
        },
        {
            id: SOCIALS,
            name: 'Contacts',
            icon: 'mail-bulk',
        },
    ]

    const editingStatus = ref(false)
    const editingAvatar = ref(false)
    const status = ref(me.value.shortDescription || '')

    const DEFAULT_TAB = tabs[0]

    const components = {
        [CLUBS]: h(AppSuspense, { key: CLUBS }, { default: () => h(SettingsClubs) }),
        [SOCIALS]: h(AppSuspense, { key: SOCIALS }, { default: () => h(SettingsSocials) }),
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
                    message: `Erreur: ${err.toString()}`,
                    type: 'error',
                })
            })
    }
    const onAvatarUploadFailure = (err) => {
        console.error('Failed to upload avatar')
        emitter.emit('show-toast', {
            message: `Erreur: ${err.toString()}`,
            type: 'failure',
        })
    }

    const onAvatarUploadSuccess = (avatar) => {
        avatar.response.json().then((user) => {
            auth.updateUser(user)
            me.value = { ...me.value, ...user }
        })

        emitter.emit('show-toast', {
            message: 'Avatar mis à jour.',
            type: 'success',
        })
    }
</script>

<style lang="scss">
    .button-grey {
        transition: box-shadow 0.3s ease-in-out, filter 0.3s ease-in-out;

        @apply bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 shadow-white;

        .dark &:hover {
            filter: brightness(1.2);
        }

        &.with-shadow:hover {
            box-shadow: 0 2px 12px 0 rgb(255 255 255 / 50%);
        }
    }

    .avatar-cropper .avatar-cropper-container .avatar-cropper-footer .avatar-cropper-btn {
        @apply bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-400;
    }

    .avatar-cropper-container {
        @apply rounded-xl overflow-hidden;
    }
</style>
