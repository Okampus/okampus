<template>
    <AppLoader />
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import { showErrorToast, showSuccessToast, showToastGraphQLError } from '@/utils/toast'

    import { useQuery } from '@vue/apollo-composable'
    import { useRouter } from 'vue-router'

    import { getMe } from '@/graphql/queries/auth/getMe'
    import { logOutOnExpire } from '@/utils/logOutOnExpire'
    import { emitter } from '@/shared/modules/emitter'

    import localStore from '@/store/local.store'

    const router = useRouter()
    const { onResult, onError } = useQuery(getMe)

    onResult(({ data }) => {
        if (data.me) {
            localStore.value.me = data.me
            logOutOnExpire()
            emitter.emit('login')
            showSuccessToast('Connexion réussie !')
        } else {
            showErrorToast("[Erreur] Vos informations utilisateur n'ont pas pu être récupérées.")
        }
        router.replace(localStore.value.wantedUrl ?? '/')
        localStore.value.wantedUrl = null
    })
    onError(showToastGraphQLError)
</script>
