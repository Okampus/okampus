<template>
    <div class="card min-w-[30vw]">
        <div class="flex flex-col items-center">
            <slot />

            <a v-if="show === 'sso'" role="button" class="button-blue my-8 text-2xl" :href="myEfreiAuthUrl"
                >Connexion myEfrei<i class="fa fa-sign-in ml-2"
            /></a>

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
                <button class="button-green mt-4 w-full" @click="login">Connexion Okampus</button>

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
    import { emitter } from '@/shared/modules/emitter'
    import { reactive, ref } from 'vue'

    import { TOAST_ERRORS } from '@/utils/errors'
    import { errorCodes } from '@/shared/errors/app-exceptions.enum'

    const myEfreiAuthUrl = `${import.meta.env.VITE_API_URL}/auth/myefrei`

    const auth = useAuthStore()
    const show = ref('sso')

    defineProps({
        headerText: {
            type: String,
            default: 'Connexion',
        },
    })

    const user = reactive({
        username: '',
        password: '',
    })

    const emit = defineEmits(['logged-in'])

    const login = () => {
        if (!user.username || !user.password) {
            return
        }

        auth.logIn(user)
            .then(() => {
                emit('logged-in', false)
                emitter.emit('show-toast', {
                    message: 'Connexion réussie !',
                    type: 'success',
                })
            })
            .catch((err) => {
                if (err.response?.status === 0) {
                    emitter.emit('show-toast', TOAST_ERRORS[errorCodes.NETWORK_ERROR])
                } else {
                    emitter.emit('show-toast', {
                        message: 'Identifiants incorrects.',
                        type: 'error',
                    })
                }
            })
    }
</script>
