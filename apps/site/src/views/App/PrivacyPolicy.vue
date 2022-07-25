<template>
    <div class="centered-container flex flex-col gap-16 p-8 md:p-16 md:pr-20">
        <div class="flex gap-8 sm:justify-between sm:pr-20 md:justify-start md:gap-12 md:pr-0">
            <div class="text-0 flex flex-col gap-6">
                <div class="title-font text-3xl font-bold md:text-5xl">Détenez vos données sur Okampus.</div>
                <div class="text-2 text-xl italic md:text-2xl">Politique de confidentialité & RGPD</div>
            </div>
            <img class="-mt-3 h-28 w-28 md:-mt-6 md:h-40 md:w-40 lg:ml-32" :src="Locker" />
        </div>

        <div class="flex flex-col gap-14 md:flex-row lg:gap-24">
            <div class="flex shrink-0 grow flex-col gap-6 md:max-w-[45%]">
                <AppTitle title="Cookies utilisés" icon="fas fa-cookie" class="text-2xl" />
                <div class="text-0 flex flex-col gap-8">
                    <div class="text-lg"><b>2 cookies techniques</b> nécessaires sont utilisés :</div>
                    <ul class="flex list-outside list-disc flex-col gap-8 pl-10">
                        <li>
                            <pre class="highlighted-field italic lg:text-lg">accessToken</pre>
                            +
                            <pre class="highlighted-field italic lg:text-lg">accessTokenExpiresAt</pre>
                            <div class="mt-6 mb-4">
                                <u class="lg:text-lg">Finalité</u> : authentifier un utilisateur (nécessaire
                                pour réaliser des actions sur la plateforme) / connaître la date d'expiration
                                du token
                            </div>
                            <div><u class="lg:text-lg">Rétention</u> : 8 heures (durée d'une session)</div>
                        </li>
                        <li>
                            <pre class="highlighted-field italic lg:text-lg">refreshToken</pre>
                            +
                            <pre class="highlighted-field italic lg:text-lg">refreshTokenExpiresAt</pre>
                            <div class="flex-inline mt-6 mb-4 items-center gap-2">
                                <u class="lg:text-lg">Finalité</u> : renouveler son
                                <pre class="highlighted-field">accessToken</pre>
                                / connaître la date d'expiration du token
                            </div>
                            <div><u class="lg:text-lg">Rétention</u> : 7 jours</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex flex-col gap-6">
                <AppTitle title="Données collectées" icon="fas fa-database" class="text-2xl" />
                <div class="text-0 flex flex-col gap-8">
                    <div class="text-lg"><b>2 types de données personnelles</b> sont collectées :</div>
                    <ul class="flex list-outside list-disc flex-col gap-8 pl-10">
                        <li>
                            <div class="flex-inline mb-6 gap-2 italic lg:text-lg">
                                Données nécessaires à l'authentification (
                                <pre class="highlighted-field">prénom</pre>
                                ,
                                <pre class="highlighted-field">nom</pre>
                                ,
                                <pre class="highlighted-field">ID d'école</pre>
                                ,
                                <pre class="highlighted-field">email</pre>
                                ,
                                <pre class="highlighted-field">rôle dans l'école</pre>
                                )
                            </div>
                            <div class="mb-4">
                                <u class="lg:text-lg">Finalité</u> : identifier un utilisateur sur la
                                plateforme (éviter de potentiels abus avec un anonymat complet, comprendre le
                                rôle d'un utilisateur au sein de l'école ...)
                            </div>
                            <div>
                                <u class="lg:text-lg">Rétention</u> : durée de vie du compte (par défaut,
                                étendable par l'utilisateur)
                            </div>
                        </li>
                        <li>
                            <div class="flex-inline mb-6 gap-2 italic lg:text-lg">
                                Données créées ou partagées par les utilisateurs (
                                <pre class="highlighted-field">contenus</pre>
                                ,
                                <pre class="highlighted-field">événements</pre>
                                ,
                                <pre class="highlighted-field">équipes</pre>
                                ,
                                <pre class="highlighted-field">fichiers</pre>
                                ,
                                <pre class="highlighted-field">rôle dans l'école</pre>
                                )
                            </div>
                            <div class="mb-4 flex items-center gap-2">
                                <u class="lg:text-lg">Finalité</u> : permettre l'activité des différents
                                espaces de la plateforme
                            </div>
                            <div>
                                <u class="lg:text-lg">Rétention</u> : non-anonymisé - durée de vie du compte
                                (par défaut, étendable par l'utilisateur) ; anonymisé - archivage définitif
                                (par défaut) ; supprimable ou anonymisable à tout moment à la demande de
                                l'utilisateur
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-10">
            <AppTitle title="Préférences" icon="fas fa-gears" class="text-2xl" />
            <div class="text-1 flex flex-col gap-6 md:flex-row md:gap-14 lg:gap-24">
                <div class="flex shrink-0 grow flex-col md:max-w-[45%]">
                    <div class="flex justify-between gap-8">
                        <div><b>Anonymiser mes données</b> à la désactivation de mon compte</div>
                        <SwitchInput v-model="state.autoAnonymise" />
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="flex justify-between gap-8">
                        <div>
                            Me transmettre <b>un export de mes données</b> à la désactivation de mon compte
                        </div>
                        <SwitchInput v-model="state.sendDump" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-2 md:flex-row md:gap-6">
            <div class="button-blue flex w-fit items-center gap-2">
                <i class="fas fa-download"></i>Exportez mes données
            </div>
            <div class="button-grey w-fit">Demande relative à mes données</div>
        </div>
    </div>
</template>

<script setup>
    import AppTitle from '@/components/App/AppTitle.vue'
    import Locker from '@/assets/img/3dicons/locker.png'
    import SwitchInput from '@/components/Input/SwitchInput.vue'
    import { useLocalStorage } from '@vueuse/core'

    const state = useLocalStorage('RGPD', { autoAnonymise: true, sendDump: false })
</script>

<style lang="scss">
    .highlighted-field {
        @apply bg-4-light dark:bg-4-dark rounded-md px-0.5 w-fit inline;
    }
</style>
