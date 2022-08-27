<template>
    <div class="card-0 min-w-[30vw]">
        <div class="flex flex-col items-center">
            <slot />

            <a v-if="show === 'sso'" :href="myEfreiAuthUrl">
                <button role="button" class="button-blue my-8 flex items-center text-2xl">
                    Connexion myEfrei <i class="fa fa-sign-in ml-2" />
                </button>
            </a>

            <form
                v-if="show === 'login'"
                action="javascript:void(0);"
                class="mt-6 flex w-full flex-col items-center gap-3 px-10"
            >
                <div class="w-full">
                    <label
                        for="username"
                        class="block text-sm font-semibold uppercase tracking-wider text-gray-600"
                        >Identifiant</label
                    >
                    <InputWithIcon
                        v-model="user.username"
                        class="text-sm"
                        input-name="username"
                        :input-required="true"
                        input-placeholder="Identifiant Okampus"
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
                        v-model="user.password"
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
                <button class="button-green mt-4 w-full" @click="loginUser(user)">Connexion Okampus</button>

                <div class="my-4 flex text-slate-500">
                    <div>ou</div>
                    <div class="ml-2 cursor-pointer underline hover:text-slate-400" @click="show = 'sso'">
                        Connexion myEfrei
                    </div>
                </div>
            </form>
            <div v-else class="mb-4 flex text-slate-500">
                <div>ou</div>
                <div class="ml-2 cursor-pointer underline hover:text-slate-400" @click="show = 'login'">
                    Connexion Okampus
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import InputWithIcon from '@/components/Input/InputWithIcon.vue'
    import { useAuthStore } from '@/store/auth.store'
    import { ref } from 'vue'

    import { useMutation } from '@vue/apollo-composable'
    import { login } from '@/graphql/queries/auth/loginUser'

    import { showErrorToast, showSuccessToast, showToastGraphQLError } from '@/utils/toast'
    import { emitter } from '@/shared/modules/emitter'
    import { getExpirationDate, logOutOnExpire } from '@/utils/logOutOnExpire'

    const myEfreiAuthUrl = `${import.meta.env.VITE_API_URL}/auth/myefrei`

    const show = ref('sso')

    defineProps({
        headerText: {
            type: String,
            default: 'Connexion',
        },
    })

    const user = ref({ username: '', password: '' })

    const emit = defineEmits(['logged-in'])
    const { mutate: loginUser, onDone, onError } = useMutation(login)

    const auth = useAuthStore()
    onDone(({ data }) => {
        auth.user = data.login
        auth.expiresAt = getExpirationDate()
        console.log('auth.expiresAt', auth.expiresAt)
        logOutOnExpire(auth.expiresAt)
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
