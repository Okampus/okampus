<template>
    <AppLoader />
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import { useAuthStore } from '@/store/auth.store'
    import { showToastGraphQLError } from '@/utils/errors'
    import { useQuery } from '@vue/apollo-composable'
    import { useRouter } from 'vue-router'

    import { getMe } from '@/graphql/queries/auth/getMe'
    import { emitter } from '@/shared/modules/emitter'

    const router = useRouter()
    const { onResult, onError } = useQuery(getMe)

    const auth = useAuthStore()

    onResult(({ data }) => {
        if (data.me) {
            auth.user = data.me
            emitter.emit('show-toast', {
                message: 'Connexion réussie !',
                type: 'success',
            })
        } else {
            emitter.emit('show-toast', {
                message: "[Erreur] Vos informations utilisateur n'ont pas pu être récupérées.",
                type: 'error',
            })
        }
        router.push('/')
    })
    onError(showToastGraphQLError)
</script>
