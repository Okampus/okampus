<template>
    <!-- TODO: Solve repeated ESC popover -->
    <AppModal :show="showLogin" @close="$emit('toggle-login')">
        <Transition name="fade">
            <div
                class="min-w-[50vw] card"
            >
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
                                    input-placeholder="Entrez votre identifiant..."
                                >
                                    <font-awesome-icon icon="user-shield" class="ml-0.5" />
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
                                    input-placeholder="Entrez votre mot de passe..."
                                >
                                    <font-awesome-icon icon="key" class="ml-0.5" />
                                </InputWithIcon>
                            </div>
                        </div>

                        <!-- TODO: Error message when login fails -->
                        <div class="flex flex-col justify-center items-center mt-10 space-y-2">
                            <button
                                type="submit"
                                class="py-3 w-full text-sm font-medium text-white uppercase bg-gray-500 hover:bg-gray-400 rounded-sm focus:outline-none hover:shadow-none"
                                @click="handleLogin"
                            >
                                Connexion Horizon
                            </button>
                        </div>

                        <div class="flex flex-col justify-center items-center mt-10 space-y-2">
                            <button
                                type="submit"
                                class="py-3 w-full text-sm font-medium text-white uppercase bg-blue-500 hover:bg-blue-400 rounded-sm focus:outline-none hover:shadow-none"
                                @click="myEfreiLogin"
                            >
                                Connexion myEfrei
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </AppModal>
</template>

<script lang="js">
    import InputWithIcon from '@/components/Input/InputWithIcon.vue'
    import User from '@/models/user'
    import AppModal from '../App/AppModal.vue'

    export default {
        components: {
            InputWithIcon,
            AppModal,
        },
        props: {
            showLogin: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['toggle-login'],
        data () {
            return { user: new User('', '', '') }
        },
        methods: {
            myEfreiLogin() {
                window.location.href = `${import.meta.env.VITE_API_URL}/auth/myefrei`
            },
            handleLogin () {
                this.loading = true
                if (this.user.username && this.user.password) {
                    this.$store.dispatch('auth/login', this.user).then(
                        (data) => {
                            this.message = data.toString()
                            this.$emitter.emit('login')
                        },
                        error => {
                            this.loading = false
                            this.message =
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                        },
                    )
                }
            },
        },
    }
</script>

<style lang="scss">
    // .centered-fixed {
    //     position: fixed;
    //     top: 0;
    //     left: 0;
    //     transform: translate(calc(50vw - 50%), calc(50vh - 50%));
    // }
</style>
