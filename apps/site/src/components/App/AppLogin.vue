<template>
    <div class="min-w-[30vw] card">
        <div class="flex flex-col">
            <slot />

            <div class="flex flex-col justify-center items-center mt-12 mb-10 space-y-2">
                <a
                    class="py-3 w-full text-xl font-medium text-center text-white uppercase bg-blue-700 hover:bg-blue-600 rounded-md focus:outline-none shadow-xl"
                    :href="myEfreiAuthUrl"
                    >Connexion myEfrei <i class="ml-2 fa fa-sign-in"
                /></a>
            </div>

            <form action="javascript:void(0);">
                <div class="mt-4 space-y-3">
                    <div>
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
                    <div>
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
                </div>

                <!-- TODO: Error message when login fails -->
                <div class="flex flex-col justify-center items-center mt-10 space-y-2">
                    <button
                        type="submit"
                        class="py-3 w-full text-sm font-medium text-white uppercase bg-gray-500 hover:bg-gray-400 rounded-md focus:outline-none shadow-xl"
                        @click="login"
                    >
                        Connexion Okampus
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import InputWithIcon from '@/components/Input/InputWithIcon.vue'
    import { useAuthStore } from '@/store/auth.store'
    import { emitter } from '@/shared/modules/emitter'
    import { reactive } from 'vue'

    const myEfreiAuthUrl = `${import.meta.env.VITE_API_URL}/auth/myefrei`

    const auth = useAuthStore()

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

        auth.logIn(user).then(() => {
            emit('logged-in', false)
            emitter.emit('show-toast', {
                message: 'Connexion réussie !',
                type: 'success',
            })
        })
    }
</script>
