<template>
    <div class="relative h-content">
        <Transition name="switch">
            <div
                v-if="!auth.agreedToTerms"
                class="flex absolute top-0 left-0 z-10 justify-center items-center w-full h-full"
            >
                <div
                    class="flex overflow-scroll flex-col p-6 m-6 max-w-3xl max-h-[calc(100%-3rem)] rounded-xl bg-0 text-1"
                >
                    <div class="mb-10">
                        <div class="text-3xl font-semibold text-center text-0">
                            Bienvenue sur la bêta de Okampus !
                        </div>
                        <div class="text-center text-3">
                            Prenez connaissances de quelques informations importantes.
                        </div>
                    </div>
                    <ol
                        class="flex flex-col gap-8 child:pl-2 mx-6 child:marker:text-base text-lg list-decimal text-justify text-0"
                    >
                        <li>
                            Rejoignez le
                            <a class="mx-1 font-mono link-blue" href="https://discord.gg/RSgTfjGQpU"
                                >Discord Okampus</a
                            >
                            pour participer officiellement à la bêta du site.
                            <span class="text-sm italic"
                                >Retrouvez toutes les informations du projet sur
                                <a
                                    target="_blank"
                                    class="p-0.5 mx-1 font-mono bg-[#474e7d] hover:bg-[#5865f2] rounded cursor-pointer text-0"
                                    href="https://discord.com/channels/980082761735995392/980093419517014046"
                                    ><span class="mr-0.5 text-xl">#</span>okampus</a
                                >.</span
                            >
                        </li>
                        <li>
                            <div class="mb-3">
                                <a
                                    class="mr-1 font-mono link-blue"
                                    href="https://www.myefrei.fr/public/sso/donnees-personnelles"
                                    >La SSO myEfrei</a
                                >
                                est nécessaire pour accéder à Okampus.
                            </div>
                            Votre <b class="text-0">prénom, nom, ID et adresse mail Efrei</b> sont les seules
                            données récupérées, nécessaires pour vous identifier.
                        </li>
                        <li>
                            <div class="mb-3">Vos informations sont publiques sur votre profil.</div>
                            <div class="mb-3">
                                Durant la bêta, il n'y aura pas de garantie que vous puissiez supprimer
                                manuellement les données et contenus que vous ajoutez.
                            </div>
                            Pour demander la suppression de vos données personnelles et l'anonymisation de vos
                            contenus,
                            <a class="mr-1 font-mono link-blue" href="mailto:rgpd@okampus.fr"
                                >envoyez un mail à rgpd@okampus.fr</a
                            >
                        </li>
                        <li>
                            Les conditions générales d'utilisation, mentions légales et informations RGPD
                            seront mises à jour en production.
                        </li>
                        <li>
                            Pour toute question ou remarque,
                            <a class="mr-1 font-mono link-blue" href="https://discord.gg/RSgTfjGQpU"
                                >contactez-nous sur Discord</a
                            >
                            ou
                            <a class="mr-1 font-mono link-blue" href="mailto:bonjour@okampus.fr"
                                >envoyez un mail à bonjour@okampus.fr</a
                            >
                        </li>
                    </ol>
                    <div
                        class="self-end mt-10 min-w-[3rem] text-lg text-center select-none button-submit"
                        :class="counting ? 'opacity-50' : ''"
                        :disabled="counting"
                        @click="auth.agreeToTerms"
                    >
                        <vue-countdown
                            v-if="counting"
                            v-slot="{ totalSeconds }"
                            :time="10000"
                            @end="onCountdownEnd"
                            >{{ totalSeconds }}</vue-countdown
                        >
                        <div v-else>J'ai pris connaissance de ces informations</div>
                    </div>
                </div>
            </div>

            <div
                v-else-if="!auth.loggedIn"
                class="flex absolute top-0 left-0 z-10 justify-center items-center w-full h-full"
            >
                <AppLogin class="absolute z-10 w-[80vw] opacity-90 md:w-[60vw] lg:w-[40vw]">
                    <div class="flex flex-col items-center -mt-12 w-full">
                        <div class="flex justify-center py-3 w-10/12 bg-indigo-700 rounded-xl opacity-100">
                            <div class="w-[12rem] h-[4rem] logo" />
                        </div>
                        <div class="mt-8 text-2xl text-center">
                            Connectez-vous pour accéder aux espaces 🔒
                        </div>
                    </div>
                </AppLogin>
            </div>
            <div v-else class="flex absolute top-0 left-0 z-10 justify-center items-center w-full h-full">
                <div class="flex z-10 flex-col gap-4 p-4 min-w-[20rem] rounded-xl text-0 bg-opacity/80 bg-2">
                    <div class="text-3xl">
                        {{ new Date().getHours() > 19 ? 'Bonsoir' : 'Bonjour' }}
                        {{ auth.user.firstname.split(' ')[0] }} !
                    </div>
                    <router-link
                        class="text-2xl text-blue-600 dark:text-blue-400 hover-arrow-right"
                        to="/clubs"
                        >Voir les associations<i class="ml-2 fa fa-arrow-right"
                    /></router-link>
                </div>
            </div>
        </Transition>
    </div>
    <Particles
        id="tsparticles"
        class="absolute top-0 w-full h-content"
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
</template>

<script setup>
    import VueCountdown from '@chenfengyuan/vue-countdown'
    import AppLogin from '@/components/App/AppLogin.vue'
    import { useAuthStore } from '@/store/auth.store'
    import { ref } from 'vue'

    const auth = useAuthStore()
    const counting = ref(true)

    const onCountdownEnd = () => {
        counting.value = false
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
