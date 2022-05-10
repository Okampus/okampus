<template>
    <!-- TODO: Solve repeated ESC popover -->
    <AppModal :show="showLogin" @close="emit('update:show-login', false)">
        <Transition name="fade">
            <div class="min-w-[50vw] card">
                <div class="flex flex-col">
                    <h2 class="text-3xl font-semibold text-center text-1">Connexion</h2>
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
                                    input-name="username"
                                    :input-required="true"
                                    input-placeholder="Entrez votre identifiant..."
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
                                    input-name="password"
                                    input-type="password"
                                    :input-required="true"
                                    input-placeholder="Entrez votre mot de passe..."
                                >
                                    <i class="ml-0.5 fas fa-key" />
                                </InputWithIcon>
                            </div>
                        </div>

                        <!-- TODO: Error message when login fails -->
                        <div class="flex flex-col justify-center items-center mt-10 space-y-2">
                            <button
                                type="submit"
                                class="py-3 w-full text-sm font-medium text-white uppercase bg-gray-500 hover:bg-gray-400 rounded-sm focus:outline-none hover:shadow-none"
                                @click="login"
                            >
                                Connexion Horizon
                            </button>
                        </div>

                        <div class="flex flex-col justify-center items-center mt-10 space-y-2">
                            <a
                                class="py-3 w-full text-sm font-medium text-center text-white uppercase bg-blue-500 hover:bg-blue-400 rounded-sm focus:outline-none hover:shadow-none"
                                :href="myEfreiAuthUrl"
                                >Connexion myEfrei</a
                            >
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </AppModal>
</template>

<script setup>
    import InputWithIcon from '@/components/Input/InputWithIcon.vue'
    import AppModal from '@/components/App/AppModal.vue'
    import { useAuthStore } from '@/store/auth.store'
    import { emitter } from '@/shared/modules/emitter'
    import { reactive } from 'vue'

    const myEfreiAuthUrl = `${import.meta.env.VITE_API_URL}/auth/myefrei`
    const auth = useAuthStore()

    defineProps({
        showLogin: {
            type: Boolean,
            required: true,
        },
    })

    const emit = defineEmits(['update:show-login'])

    const user = reactive({
        username: '',
        password: '',
    })

    const login = () => {
        if (!user.username || !user.password) {
            return
        }

        auth.logIn(user).then(() => {
            emit('update:show-login', false)
            emitter.emit('show-toast', {
                message: 'Connexion réussie !',
                type: 'success',
            })
        })
    }
</script>
