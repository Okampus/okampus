<template>
    <div>
        <ProfileAvatar
            :avatar="entity.avatar"
            :="avatarProps"
            :name="entityType === 'user' ? entity.title ?? fullname(entity) : entity.name ?? entity.title"
            :size="size"
        >
            <template #icon>
                <div
                    v-if="entity.avatar"
                    class="absolute"
                    :class="avatarProps.roundedFull === false ? '-right-3 -bottom-3' : 'right-0 bottom-0'"
                >
                    <ModalDropdown :buttons="avatarButtons">
                        <button class="button-grey button-circle">
                            <i class="fa fa-camera" />
                        </button>
                    </ModalDropdown>
                </div>
                <button
                    v-else
                    class="button-grey button-circle absolute"
                    :class="avatarProps.roundedFull === false ? '-right-3 -bottom-3' : 'right-0 bottom-0'"
                    @click="editingAvatar = true"
                >
                    <i class="fa fa-camera" />
                </button>
            </template>
        </ProfileAvatar>
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
</template>

<script setup>
    import AvatarCropper from 'vue-avatar-cropper'

    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import ModalDropdown from '@/components/UI/Modal/ModalDropdown.vue'

    import { emitter } from '@/shared/modules/emitter'
    import { computed, ref } from 'vue'

    import { updateUser } from '@/graphql/queries/users/updateUser'
    import { updateTeam } from '@/graphql/queries/teams/updateTeam'

    import { showErrorToast, showSuccessToast } from '@/utils/toast'
    import { useMutation } from '@vue/apollo-composable'
    import { apolloClient } from '@/shared/modules/apollo.client'
    import { getUser } from '@/graphql/queries/users/getUserById'
    import { getClub } from '@/graphql/queries/teams/getClub'

    import { fullname } from '@/utils/users'

    import localStore from '@/store/local.store'
    import { getTenant } from '@/utils/getTenant'

    const props = defineProps({
        entity: {
            type: Object,
            required: true,
        },
        entityType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            default: 3,
        },
        avatarProps: {
            type: Object,
            default: () => ({}),
        },
    })

    const uploadAvatarUrl = computed(() =>
        props.entityType === 'user'
            ? `${import.meta.env.VITE_API_URL}/users/avatar`
            : `${import.meta.env.VITE_API_URL}/teams/teams/${props.entity.id}/avatar`,
    )

    const { mutate: updateUserMutation, onDone: onDoneUser, onError: onErrorUser } = useMutation(updateUser)
    onDoneUser(() => showSuccessToast('Photo de profil mise à jour 📷'))
    onErrorUser(() => showErrorToast('Échec de suppression de la photo de profil !'))

    const { mutate: updateTeamMutation, onDone: onDoneTeam, onError: onErrorTeam } = useMutation(updateTeam)
    onDoneTeam(() => showSuccessToast('Photo de profil mise à jour 📷'))
    onErrorTeam(() => showErrorToast('Échec de suppression de la photo de profil !'))

    const editingAvatar = ref(false)
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
                if (props.entityType === 'user') {
                    updateUserMutation({ id: props.entity.id, user: { avatar: null } })
                    if (props.entity.id === localStore.value.me?.id)
                        localStore.value.me = { ...localStore.value.me, avatar: null }
                } else if (props.entityType === 'team') {
                    updateTeamMutation({ id: props.entity.id, team: { avatar: null } })
                }
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
            avatar.response.json().then((entity) => {
                if (props.entityType === 'user') {
                    apolloClient.writeQuery({
                        query: getUser,
                        data: {
                            userById: entity,
                        },
                        variables: {
                            id: entity.id,
                        },
                    })
                    if (entity.id === localStore.value.me?.id) {
                        localStore.value.me = { ...localStore.value.me, ...entity }
                    }
                } else {
                    apolloClient.writeQuery({
                        query: getClub,
                        data: {
                            clubById: entity,
                        },
                        variables: {
                            id: entity.id,
                        },
                    })
                }
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
