<template>
    <div class="centered-container flex flex-col gap-8 p-8 md:p-16 md:pr-20">
        <div class="flex gap-8 sm:justify-between sm:pr-20 md:justify-start md:gap-12 md:pr-0">
            <div class="text-0 flex flex-col gap-6">
                <div class="title-font text-3xl font-bold md:text-5xl">Détenez vos données sur Okampus.</div>
                <div class="text-1 text-xl md:text-2xl">Politique de confidentialité & RGPD</div>
            </div>
            <img class="-mt-3 h-28 w-28 md:-mt-6 md:h-40 md:w-40 lg:ml-32" :src="Locker" />
        </div>

        <div class="flex flex-col gap-14 md:flex-row lg:gap-24">
            <div class="flex shrink-0 grow flex-col gap-6 md:max-w-[45%]">
                <AppTitle title="Cookies utilisés" icon="fas fa-cookie" class="text-1" />
                <div class="text-0 flex flex-col gap-8">
                    <div><b>2 cookies techniques</b> nécessaires sont utilisés :</div>
                    <ul class="flex list-outside list-disc flex-col gap-8 pl-10">
                        <li>
                            <code class="highlighted-field italic lg:text-lg">accessToken</code>
                            +
                            <code class="highlighted-field italic lg:text-lg">accessTokenExpiresAt</code>
                            <div class="mt-6 mb-4">
                                <u class="lg:text-lg">Finalité</u> : authentifier un utilisateur (nécessaire
                                pour réaliser des actions sur la plateforme) + connaître la date d'expiration
                                du token
                            </div>
                            <div><u class="lg:text-lg">Rétention</u> : 8 heures (durée d'une session)</div>
                        </li>
                        <li>
                            <code class="highlighted-field italic lg:text-lg">refreshToken</code>
                            +
                            <code class="highlighted-field italic lg:text-lg">refreshTokenExpiresAt</code>
                            <div class="flex-inline mt-6 mb-4 items-center gap-2">
                                <u class="lg:text-lg">Finalité</u> : renouveler son
                                <code class="highlighted-field">accessToken</code>
                                + connaître la date d'expiration du token
                            </div>
                            <div><u class="lg:text-lg">Rétention</u> : 7 jours</div>
                        </li>
                    </ul>
                    <ul class="flex list-outside list-disc flex-col gap-4">
                        <li>
                            Les cookies sont des <a href="https://jwt.io/" class="link-blue">JWT</a> signés
                            avec une clé secrète et sécurisés en
                            <a
                                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies"
                                class="link-blue"
                                >HttpOnly</a
                            >
                            : ils ne peuvent pas être lus par des scripts injectés dans le navigateur.
                        </li>
                        <li>
                            Les cookies ne sont
                            <a
                                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies"
                                class="link-blue"
                                >valides qu'en HTTPS</a
                            >, emêchant les attaques man-in-the-middle du protocole HTTP.
                        </li>
                        <li>
                            Les requêtes pouvant transmettre ces cookies sont limités au domaine 'okampus.fr'
                            et ne sont pas accessibles par d'autres applications (pas de tracking d'autres
                            sites ou
                            <a
                                href="https://en.wikipedia.org/wiki/Cross-site_request_forgery#SameSite_cookie_attribute"
                                class="link-blue"
                                >d'attaque CSRF</a
                            >).
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex flex-col gap-6">
                <AppTitle title="Données collectées" icon="fas fa-database" class="text-1" />
                <div class="text-0 flex flex-col gap-8">
                    <div><b>2 types de données personnelles</b> sont collectées :</div>
                    <ul class="flex list-outside list-disc flex-col gap-8 pl-10">
                        <li>
                            <div class="mb-6 italic lg:text-lg">
                                Données nécessaires à l'authentification (<code class="highlighted-field"
                                    >prénom</code
                                >, <code class="highlighted-field">nom</code>,
                                <code class="highlighted-field">ID d'école</code>,
                                <code class="highlighted-field">email</code>,
                                <code class="highlighted-field">rôle dans l'école</code>...)
                            </div>
                            <div class="mb-4">
                                <u class="lg:text-lg">Finalité</u> : identifier un utilisateur sur la
                                plateforme (éviter de potentiels abus avec un anonymat complet, comcodendre le
                                rôle d'un utilisateur au sein de l'école ...)
                            </div>
                            <div>
                                <u class="lg:text-lg">Rétention</u> : durée de vie du compte (par défaut,
                                étendable par l'utilisateur)
                            </div>
                        </li>
                        <li>
                            <div class="mb-6 italic lg:text-lg">
                                Données créées ou partagées par les utilisateurs (<code
                                    class="highlighted-field"
                                    >contenus</code
                                >, <code class="highlighted-field">événements</code>,
                                <code class="highlighted-field">équipes</code>,
                                <code class="highlighted-field">fichiers</code>,
                                <code class="highlighted-field">rôle dans l'école</code>)
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

        <div v-if="auth.loggedIn">
            <div class="flex flex-col gap-10">
                <AppTitle title="Préférences" icon="fas fa-gears" class="text-1" />
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
                                Me transmettre <b>un export de mes données</b> à la désactivation de mon
                                compte
                            </div>
                            <SwitchInput v-model="state.sendDump" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-8 flex gap-2 md:gap-6">
                <button class="button-blue flex w-fit items-center gap-2">
                    <i class="fas fa-download"></i>Exportez mes données
                </button>
                <button class="button-grey w-fit">Demande relative à mes données</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import AppTitle from '@/components/App/AppTitle.vue'
    import Locker from '@/assets/img/3dicons/locker.png'
    import SwitchInput from '@/components/Input/SwitchInput.vue'
    import { useAuthStore } from '@/store/auth.store'
    import { useLocalStorage } from '@vueuse/core'

    const auth = useAuthStore()
    const state = useLocalStorage('RGPD', { autoAnonymise: true, sendDump: false })
</script>

<style lang="scss">
    .highlighted-field {
        @apply bg-4-light dark:bg-4-dark rounded-md px-0.5 w-fit inline;
    }
</style>
