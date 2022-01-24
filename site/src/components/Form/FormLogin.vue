<template>
    <!-- TODO: Solve repeated ESC popover -->
    <TransitionRoot v-if="!$store.state.auth.status.loggedIn" appear :show="showLogin" as="template">
        <Dialog as="div" @close="$emit('toggle-login')">
            <div class="overflow-y-auto fixed inset-0 z-10">
                <div class="px-4 min-h-screen text-center">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <DialogOverlay class="fixed inset-0" />
                    </TransitionChild>

                    <span class="inline-block h-screen align-middle" aria-hidden="true"> &#8203; </span>

                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <div
                            class="inline-block overflow-hidden p-6 my-8 w-full max-w-md text-left align-middle bg-white rounded-2xl shadow-xl transition-all card-0"
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
                                            CONNEXION HORIZON
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
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="js">
import {
    TransitionRoot,
    Dialog,
    TransitionChild,
    DialogOverlay,
} from '@headlessui/vue'
import InputWithIcon from '@/components/Input/InputWithIcon.vue'
import User from '@/models/user'
const API_URL = `${import.meta.env.VITE_API_URL}`

export default {
    components: {
        TransitionChild,
        InputWithIcon,
        TransitionRoot,
        Dialog,
        DialogOverlay,
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
            window.location.href = `${API_URL}/auth/myefrei`
        },
        handleLogin () {
            this.loading = true

            if (this.user.username && this.user.password) {
                this.$store.dispatch('auth/login', this.user).then(
                    (data) => {
                        this.message = data.toString()
                        this.emitter.emit('login')
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
