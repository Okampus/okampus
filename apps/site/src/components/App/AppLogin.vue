<template>
    <div class="card-0 min-w-[30vw]">
        <div v-if="!loading" class="mb-6 flex flex-col items-center">
            <slot />

            <template v-if="result?.oidcEnabled">
                <div v-if="showSso && result.oidcEnabled?.isEnabled" class="flex flex-col items-center gap-4">
                    <a :href="oidcUrl">
                        <button role="button" class="button-blue mt-8 flex items-center text-2xl">
                            Connexion
                            {{ result.oidcEnabled?.tenantOidcName ?? result.oidcEnabled?.id?.toUpperCase() }}
                            <i class="fa fa-sign-in ml-2" />
                        </button>
                    </a>
                    <div class="mt-4 flex text-slate-500">
                        <div>ou</div>
                        <div
                            class="ml-2 cursor-pointer underline hover:text-slate-400"
                            @click="showSso = false"
                        >
                            Connexion OKAMPUS
                        </div>
                    </div>
                </div>
                <div v-else class="mt-6 flex w-full flex-col items-center gap-3 px-10">
                    <div class="w-full">
                        <label
                            for="username"
                            class="block text-sm font-semibold uppercase tracking-wider text-gray-600"
                            >Identifiant</label
                        >
                        <InputWithIcon
                            v-model="username"
                            class="text-sm"
                            input-name="username"
                            :input-required="true"
                            input-placeholder="Identifiant OKAMPUS"
                        >
                            <i class="fas fa-user-shield ml-0.5" />
                        </InputWithIcon>
                    </div>
                    <div class="w-full">
                        <label
                            for="password"
                            class="mt-2 block text-sm font-semibold uppercase tracking-wider text-gray-600"
                            >Mot de passe</label
                        >
                        <InputWithIcon
                            v-model="password"
                            class="text-sm"
                            input-name="password"
                            input-type="password"
                            :input-required="true"
                            input-placeholder="Mot de passe"
                        >
                            <i class="fas fa-key ml-0.5" />
                        </InputWithIcon>
                    </div>
                    <!-- TODO: Error message when login fails -->
                    <button class="button-green mt-4 w-full" @click="loginUser({ username, password })">
                        Connexion OKAMPUS
                    </button>
                    <div v-if="result.oidcEnabled?.isEnabled" class="mt-4 flex text-slate-500">
                        <div>ou</div>
                        <div
                            class="ml-2 cursor-pointer underline hover:text-slate-400"
                            @click="showSso = true"
                        >
                            Connexion
                            {{ result.oidcEnabled?.tenantOidcName ?? result.oidcEnabled?.id?.toUpperCase() }}
                        </div>
                    </div>
                </div>
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
    import InputWithIcon from '@/components/Input/InputWithIcon.vue'

    import { useAuthStore } from '@/store/auth.store'
    import { computed, ref } from 'vue'

    import { useMutation, useQuery } from '@vue/apollo-composable'
    import { oidcEnabled } from '@/graphql/queries/config/oidcEnabled'
    import { login } from '@/graphql/queries/auth/loginUser'

    import { showErrorToast, showSuccessToast, showToastGraphQLError } from '@/utils/toast'
    import { emitter } from '@/shared/modules/emitter'
    import { logOutOnExpire } from '@/utils/logOutOnExpire'
    import { getTenant } from '@/utils/getTenant'
    import AppException from '@/views/App/AppException.vue'

    const showSso = ref(true)

    defineProps({
        headerText: {
            type: String,
            default: 'Connexion',
        },
    })

    const username = ref('')
    const password = ref('')

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

    const auth = useAuthStore()
    onDone(({ data }) => {
        auth.user = data.login
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
