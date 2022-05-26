<template>
    <div class="min-w-[30vw] card">
        <div class="flex flex-col items-center">
            <slot />

            <div v-if="show === 'sso'" class="my-8 rounded-full button">
                <a
                    class="py-3 !px-6 w-full text-2xl font-medium text-center text-white bg-blue-700 hover:bg-blue-600 !rounded-full focus:outline-none shadow-xl"
                    :href="myEfreiAuthUrl"
                    >Connexion myEfrei<i class="ml-2 fa fa-sign-in"
                /></a>
            </div>

            <form
                v-if="show === 'login'"
                action="javascript:void(0);"
                class="flex flex-col gap-3 items-center px-10 mt-6 w-full"
            >
                <div class="w-full">
                    <label
                        for="username"
                        class="block text-sm font-semibold tracking-wider text-gray-600 uppercase"
                        >Identifiant</label
                    >
                    <InputWithIcon
                        v-model="user.username"
                        class="text-sm"
                        input-name="username"
                        :input-required="true"
                        input-placeholder="Identifiant Okampus"
                    >
                        <i class="ml-0.5 fas fa-user-shield" />
                    </InputWithIcon>
                </div>
                <div class="w-full">
                    <label
                        for="password"
                        class="block mt-2 text-sm font-semibold tracking-wider text-gray-600 uppercase"
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
                        <i class="ml-0.5 fas fa-key" />
                    </InputWithIcon>
                </div>

                <!-- TODO: Error message when login fails -->
                <div class="mt-4 w-full button-green">
                    <button class="!w-full" type="submit" @click="login">Connexion Okampus</button>
                </div>

                <div class="flex my-4 text-slate-500">
                    <div>ou</div>
                    <div class="ml-2 hover:text-slate-400 underline cursor-pointer" @click="show = 'sso'">
                        Connexion myEfrei
                    </div>
                </div>
            </form>
            <div v-else class="flex mb-4 text-slate-500">
                <div>ou</div>
                <div class="ml-2 hover:text-slate-400 underline cursor-pointer" @click="show = 'login'">
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
