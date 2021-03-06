<template>
    <div>
        <div class="h-content relative">
            <Transition name="switch">
                <div
                    v-if="!auth.agreedToTerms"
                    class="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center"
                >
                    <div
                        class="bg-0 text-1 m-6 flex max-h-[calc(100%-3rem)] max-w-3xl flex-col gap-6 rounded-xl p-6"
                    >
                        <div class="mb-4">
                            <div class="text-0 text-center text-3xl font-semibold">
                                Bienvenue sur la bêta de Okampus !
                            </div>
                        </div>
                        <div class="text-xl">
                            Rejoignez le
                            <a
                                class="link-blue mx-1 font-semibold underline"
                                href="https://discord.gg/RSgTfjGQpU"
                                >Discord Okampus</a
                            >
                            pour suivre l'avancée de la bêta, donner vos avis et échanger par rapport au
                            projet.
                        </div>
                        <div class="text-xl">
                            Retrouvez toutes les informations relatives aux données personnelles sur
                            <router-link to="/rgpd" class="link-blue">https://okampus.fr/rgpd</router-link>.
                        </div>
                        <div>
                            Pour toute question ou remarque ne pouvant pas être transmise sur Discord
                            <a class="link-blue" href="mailto:bonjour@okampus.fr"
                                >envoyez un mail à bonjour@okampus.fr</a
                            >
                        </div>
                        <div class="italic">
                            Les cookies utilisés par Okampus sont des tokens d'authentification nécessaires à
                            la gestion des permissions sur la plateforme.
                        </div>
                        <div
                            class="button-blue mt-4 min-w-[3rem] select-none text-center text-lg"
                            :class="counting ? 'opacity-50' : ''"
                            :disabled="counting"
                            @click="agreeToTerms"
                        >
                            <vue-countdown
                                v-if="counting"
                                v-slot="{ totalSeconds }"
                                :time="4000"
                                @end="onCountdownEnd"
                                >{{ totalSeconds }}</vue-countdown
                            >
                            <div v-else>J'ai pris connaissance de ces informations et souhaite continuer</div>
                        </div>
                    </div>
                </div>
                <div
                    v-else-if="!auth.loggedIn"
                    class="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center"
                >
                    <AppLogin class="absolute z-10 w-[80vw] opacity-90 md:w-[60vw] lg:w-[40vw]">
                        <div class="-mt-12 flex w-full flex-col items-center">
                            <div
                                class="flex w-10/12 justify-center rounded-xl bg-indigo-700 py-3 opacity-100"
                            >
                                <AppLogo :scale="1.6" only="dark" />
                            </div>
                            <div class="mt-8 text-center text-2xl">
                                Connectez-vous pour accéder aux espaces 🔒
                            </div>
                        </div>
                    </AppLogin>
                </div>
                <div v-else class="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center">
                    <div
                        class="text-0 bg-opacity/80 bg-2 z-10 flex min-w-[20rem] flex-col gap-4 rounded-xl p-4"
                    >
                        <div class="text-3xl">
                            {{
                                new Date().getHours() > 19 || new Date().getHours() < 6
                                    ? 'Bonsoir'
                                    : 'Bonjour'
                            }}
                            {{ auth.user.firstname.split(' ')[0] }} !
                        </div>
                        <router-link
                            class="hover-arrow-right text-2xl text-blue-600 dark:text-blue-400"
                            to="/clubs"
                            >Voir les associations<i class="fa fa-arrow-right ml-2"
                        /></router-link>
                    </div>
                </div>
            </Transition>
        </div>
        <Particles
            id="tsparticles"
            class="h-content absolute top-0 w-full"
            :options="{
                background: {
                    color: '#013',
                },
                particles: {
                    number: {
                        value: 150,
                    },
                    move: {
                        direction: 'none',
                        enable: true,
                        outModes: {
                            default: 'out',
                            /* out */
                        },
                        random: true,
                        speed: 0.1,
                        straight: false,
                    },
                    opacity: {
                        animation: {
                            enable: true,
                            speed: 1,
                            sync: false,
                        },
                        value: {
                            min: 0,
                            max: 1,
                        },
                    },
                    size: {
                        value: {
                            min: 1,
                            max: 3,
                        },
                    },
                },
            }"
        />
    </div>
</template>

<script setup>
    import VueCountdown from '@chenfengyuan/vue-countdown'
    import AppLogin from '@/components/App/AppLogin.vue'
    import AppLogo from '@/components/App/AppLogo.vue'

    import { useAuthStore } from '@/store/auth.store'
    import { ref } from 'vue'

    const auth = useAuthStore()
    const counting = ref(true)

    const onCountdownEnd = () => {
        counting.value = false
    }

    const agreeToTerms = () => {
        if (!counting.value) {
            auth.agreeToTerms()
        }
    }
</script>

<style lang="scss">
    .hover-arrow-right {
        transition: color 0.3s ease-in-out;

        & i {
            transition: transform 0.3s ease-in-out;
        }

        &:hover {
            @apply text-blue-600;

            .dark & {
                color: #0af;
            }

            & i {
                transform: translateX(6px);
            }
        }
    }
</style>
