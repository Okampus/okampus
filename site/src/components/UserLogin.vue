<template>
    <!-- TODO: Solve repeated ESC popover -->
    <TransitionRoot
        v-if="!$store.state.auth.status.loggedIn"
        appear
        :show="showLogin"
        as="template"
    >
        <Dialog
            as="div"
            @close="$emit('toggle-login')"
        >
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="min-h-screen px-4 text-center">
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

                    <span
                        class="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

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
                            class="card-0 inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                        >
                            <div class="flex flex-col">
                                <h2 class="text-center font-semibold text-3xl text-1">
                                    Connexion
                                </h2>
                                <form action="javascript:void(0);">
                                    <div class="space-y-3 mt-4">
                                        <div>
                                            <label
                                                for="username"
                                                class="block tracking-wider text-sm font-semibold text-gray-600 uppercase"
                                            >Identifiant</label>
                                            <input-with-icon
                                                v-model="user.username"
                                                input-name="username"
                                                input-placeholder="Entrez votre identifiant..."
                                                :required="true"
                                            >
                                                <i class="ri-shield-user-fill ri-xl" />
                                            </input-with-icon>
                                        </div>
                                        <div>
                                            <label
                                                for="password"
                                                class="block tracking-wider mt-2 text-sm font-semibold text-gray-600 uppercase"
                                            >Mot de passe</label>
                                            <input-with-icon
                                                v-model="user.password"
                                                input-name="password"
                                                input-type="password"
                                                input-placeholder="Entrez votre mot de passe..."
                                                :required="true"
                                            >
                                                <i class="ri-key-2-fill ri-xl" />
                                            </input-with-icon>
                                        </div>
                                    </div>

                                    <!-- TODO: Error message when login fails -->
                                    <div class="flex flex-col mt-10 space-y-2 items-center justify-center">
                                        <button
                                            type="submit"
                                            class="w-full py-3 bg-gray-500 rounded-sm text-sm
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-gray-400 hover:shadow-none"
                                            @click="handleLogin"
                                        >
                                            CONNEXION HORIZON
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
            default: false
        }
    },
    emits: ['toggle-login'],
    data () {
        return {
            user: new User('', '', '')
        }
    },
    methods: {
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
                    }
                )
            }
        }
    }
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
