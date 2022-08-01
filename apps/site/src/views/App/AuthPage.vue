<template>
    <AppLoader />
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import { useAuthStore } from '@/store/auth.store'
    import { showErrorToast, showSuccessToast, showToastGraphQLError } from '@/utils/toast'

    import { useQuery } from '@vue/apollo-composable'
    import { useRouter } from 'vue-router'

    import { getMe } from '@/graphql/queries/auth/getMe'

    const router = useRouter()
    const { onResult, onError } = useQuery(getMe)

    const auth = useAuthStore()

    onResult(({ data }) => {
        if (data.me) {
            auth.user = data.me
            showSuccessToast('Connexion réussie !')
        } else {
            showErrorToast("[Erreur] Vos informations utilisateur n'ont pas pu être récupérées.")
        }
        router.push('/')
    })
    onError(showToastGraphQLError)
</script>
