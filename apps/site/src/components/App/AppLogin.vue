<template>
    <div class="min-w-[30vw]">
        <div v-if="!loading" class="mb-6 flex flex-col items-center gap-4">
            <slot />

            <template v-if="result?.oidcEnabled">
                <a :href="oidcUrl">
                    <button
                        role="button"
                        class="button-blue flex min-w-fit items-center gap-4 rounded-full py-2 pl-6 pr-5 text-lg font-medium"
                    >
                        <i class="fa fa-school" />
                        Connexion
                        {{ result.oidcEnabled?.tenantOidcName ?? result.oidcEnabled?.id?.toUpperCase() }}
                    </button>
                </a>

                <FormPopUp v-model:show="showLoginForm" :form-schema="loginFormSchema" :submit="loginUser" />

                <button
                    role="button"
                    class="button-black flex min-w-fit items-center gap-3 rounded-full py-2 px-6 text-base font-medium"
                    @click="showLoginForm = true"
                >
                    <img
                        :src="okampus"
                        alt="OKAMPUS"
                        class="inline h-7 w-7 rounded-lg border-2 border-black"
                    />
                    Connexion OKAMPUS
                </button>
            </template>
            <template v-else>
                <AppException code="404" :custom-message="`Le tenant '${getTenant()}' n'existe pas`" />
            </template>
        </div>
        <AppLoader v-else />
    </div>
</template>

<script setup>
    import AppLoader from '@/components/App/AppLoader.vue'
    import AppException from '@/views/App/AppException.vue'

    import okampus from '@/assets/img/logos/okampus.png'

    import { computed, ref } from 'vue'

    import { useMutation, useQuery } from '@vue/apollo-composable'
    import { oidcEnabled } from '@/graphql/queries/config/oidcEnabled'
    import { login } from '@/graphql/queries/auth/loginUser'

    import { showErrorToast, showSuccessToast, showToastGraphQLError } from '@/utils/toast'
    import { emitter } from '@/shared/modules/emitter'
    import { logOutOnExpire } from '@/utils/logOutOnExpire'
    import { getTenant } from '@/utils/getTenant'

    import localStore from '@/store/local.store'
    import FormPopUp from '../Form/FormPopUp.vue'

    const showLoginForm = ref(false)

    defineProps({
        headerText: {
            type: String,
            default: 'Connexion',
        },
    })

    const loginFormSchema = [
        {
            $el: 'h1',
            children: ['Connexion à Okampus 🔐'],
            attrs: {
                class: 'mb-12',
            },
        },
        {
            $formkit: 'floating',
            name: 'username',
            floatingLabel: 'Identifiant',
        },
        {
            $formkit: 'floating',
            name: 'password',
            floatingLabel: 'Mot de passe',
            inputType: 'password',
        },
    ]

    const emit = defineEmits(['logged-in'])
    const { mutate: loginUser, onDone, onError } = useMutation(login)
    const { result, loading, onError: onErrorOidc } = useQuery(oidcEnabled, { id: getTenant() })

    onErrorOidc((errors) =>
        showToastGraphQLError(
            errors,
            `Les informations du tenant '${getTenant()}' n'ont pas pu être chargées !`,
        ),
    )

    const oidcUrl = computed(() => `${import.meta.env.VITE_API_URL}/auth/${result.value.oidcEnabled?.id}`)

    onDone(({ data }) => {
        showLoginForm.value = false
        localStore.value.me = data.login
        logOutOnExpire()
        emitter.emit('login')
        emit('logged-in')
        showSuccessToast('Connexion réussie !')
    })

    onError((errors) => {
        if (errors.graphQLErrors?.[0]?.message === 'Invalid credentials') {
            showErrorToast('Identifiants incorrects')
        } else {
            showToastGraphQLError(errors)
        }
    })
</script>
