<template>
    <div>
        <div v-if="!localStore?.loggedIn" class="relative flex h-full flex-col items-center px-10 pt-32">
            <div class="text-0 text-center text-2xl font-medium">Bienvenue sur la bêta d'Okampus 👋</div>

            <AppLogin class="mt-14" />

            <div class="text-1 fixed bottom-10 text-center text-sm">
                Rejoignez le
                <a class="link-blue underline" href="https://discord.gg/RSgTfjGQpU">Discord public Okampus</a>
                ! En vous connectant sur Okampus, vous acceptez ses
                <router-link to="/rgpd" class="link-blue">conditions RGPD</router-link>.
            </div>
        </div>
        <div v-else-if="!localStore.me.finishedIntroduction">
            <Swiper pagination :modules="modules" class="text-0 my-10" @swiper="(s) => (swiper = s)">
                <SwiperButton
                    v-if="swiper?.activeIndex > 0"
                    class="absolute top-1/2 left-2"
                    :small="true"
                    type="prev"
                    :swiper="swiper"
                />
                <SwiperSlide
                    class="flex flex-col items-center justify-start gap-10 pb-20 md:px-28 lg:px-72 md-max:px-12"
                >
                    <div class="text-4xl font-semibold">
                        Qu'est-ce que
                        <img
                            class="mx-2 inline"
                            :src="localStore.darkMode === 'dark' ? logoDarkSrc : logoSrc"
                            :style="{
                                width: `12rem`,
                                height: `3rem`,
                            }"
                        />
                        ?
                    </div>
                    <div class="flex flex-col gap-8 text-left">
                        <div>
                            <b class="text-xl">Okampus</b> est une
                            <a
                                class="link-blue text-lg"
                                href="https://github.com/Okampus/okampus"
                                target="_blank"
                                >plateforme web open-source</a
                            >
                            pour les écoles visant à :
                        </div>
                        <ul class="flex flex-col gap-4">
                            <li>
                                - encourager la
                                <span class="text-lg font-medium">collaboration étudiante 🖇️</span>
                            </li>
                            <li>
                                - centraliser les remontées d'étudiants dans des
                                <span class="text-lg font-medium">bases de connaissance 📚</span>
                            </li>
                            <li>
                                - fournir des outils
                                <span class="text-lg font-medium">pour la gestion d'associations 🧰</span>
                            </li>
                            <li>
                                - simplifier le
                                <span class="text-lg font-medium"
                                    >partage de projets et de contenus entre étudiants 📣</span
                                >
                            </li>
                        </ul>
                        <div>
                            Okampus voit le jour à EFREI Paris sous la forme d'un projet bénévole de
                            l'association
                            <a
                                class="link-blue"
                                target="_blank"
                                href="https://github.com/horizon-efrei/HorizonWeb"
                                >Horizon EFREI</a
                            >, et devient le premier projet porté par
                            <a class="link-blue" target="_blank" href="https://discord.gg/TZ7VUHE9yf"
                                >Horizon : Web 🌐</a
                            >
                            (désormais
                            <a class="link-blue" target="_blank" href="https://discord.gg/TZ7VUHE9yf"
                                >Horizon : OpenDEV 🌐</a
                            >) à devenir une startup 🎉 !
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide class="flex flex-col justify-start gap-10 pb-20 md:px-28 lg:px-72 md-max:px-12">
                    <div class="text-center text-4xl font-semibold">
                        Comment participer à
                        <img
                            class="mx-2 inline"
                            :src="localStore.darkMode === 'dark' ? logoDarkSrc : logoSrc"
                            :style="{
                                width: `12rem`,
                                height: `3rem`,
                            }"
                        />
                        ?
                    </div>
                    <div class="text-left">
                        <b class="text-xl">Okampus</b> est actuellement en bêta et utilise
                        <a href="https://discord.gg/RSgTfjGQpU" target="_blank">
                            <span class="link-blue text-lg">Discord</span>
                            <img
                                :src="okampus"
                                alt="OKAMPUS"
                                class="ml-2 inline h-8 w-8 rounded-lg border-2 border-black"
                            />
                        </a>
                        pour sa gestion de projet ! <u class="text-lg">Rejoignez-le pour</u> :
                    </div>
                    <div class="flex flex-col gap-8 text-left">
                        <ul class="flex flex-col gap-4">
                            <li>
                                - suivre les
                                <span class="text-lg font-medium">devlogs du projet 📁</span>
                            </li>
                            <li>
                                - faire des
                                <span class="text-lg font-medium">suggestions de fonctionnalités ✨</span>
                            </li>
                            <li>
                                - signaler des
                                <span class="text-lg font-medium">bugs ou designs améliorables</span> sur la
                                plateforme 🌐
                            </li>
                            <li>
                                - bêta-tester des
                                <span class="text-lg font-medium"
                                    >nouvelles fonctionnalités et expériences utilisateur 🌟</span
                                >
                            </li>
                            <li>
                                - ou alors pour
                                <span class="text-lg font-medium">contribuer</span> directement au projet
                                <span class="text-lg">🔧</span> !
                            </li>
                        </ul>
                        <div>
                            La plupart des fonctionnalités d'Okampus sont actuellement cachées car elles ne
                            sont pas complètement fonctionnelles :
                            <b class="text-lg underline"
                                >la prochaine grande mise à jour est prévue pour mi-octobre 🎉</b
                            >
                        </div>
                    </div>
                    <!-- Okampus est un projet open-source toujours en voie de développement. Vous pouvez donc
                    contribuer en nous rejoignant sur notre serveur Discord (< insert hyperlink) : - suivre
                    nos actualités - proposer des fonctionnalités - signaler des bugs - intégrer notre
                    communauté -->
                </SwiperSlide>

                <SwiperSlide
                    class="app-scrollbar flex flex-col items-center justify-start gap-10 overflow-auto pb-20 md:px-28 lg:px-72 md-max:px-12"
                >
                    <div class="flex flex-col gap-2">
                        <div class="text-3xl">Découvrez :</div>
                        <div class="text-4xl font-semibold">Le swipe des associations 👏</div>
                    </div>
                    <div class="flex flex-col gap-8 text-left">
                        <div>
                            A l'occasion de la journée des associations, Okampus a prévu une
                            <span class="text-lg font-medium">expérience en ligne</span> pour
                            <span class="text-lg font-medium">découvrir les associations</span> !
                        </div>

                        <div>
                            Pour chaque association, retrouvez
                            <b class="text-xl underline"
                                >l'emplacement de leur stand pour le 08/09 à côté de la boussole 🧭</b
                            >
                            sur leur profil !
                        </div>

                        <div>
                            "Swiper" à gauche/droite pour montrer votre intérêt, cliquez en bas des cartes
                            pour
                            <span class="text-lg font-medium">obtenir plus d'informations ℹ️</span> et
                            <span class="text-lg font-medium">"swiper" en haut 💬</span> pour prendre contact
                            avec l'association !
                        </div>

                        <div>
                            ⚠️ Les associations
                            <span class="text-lg font-medium">ne vous répondront pas depuis Okampus</span>.
                            Votre email Efrei sera mise a disposition comme moyen de contact ! ⚠️
                        </div>

                        <div
                            class="hover-arrow-right mt-3 cursor-pointer text-center text-4xl text-blue-600 brightness-110 dark:text-blue-400 md-max:text-2xl"
                            @click="
                                updateUserMutation({
                                    id: localStore.me.id,
                                    user: { finishedIntroduction: true },
                                })
                            "
                        >
                            Commencer le swipe des associations<i class="fa fa-arrow-right ml-2" />
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperButton
                    v-if="swiper?.activeIndex < 2"
                    class="absolute top-1/2 right-2"
                    :small="true"
                    type="next"
                    :swiper="swiper"
                />
            </Swiper>
        </div>
        <ClubSwipe v-else />
    </div>
</template>

<script setup>
    // import DarkModeInput from '@/components/Input/DarkModeInput.vue'
    // import okampus from '@/assets/img/logos/okampus.png'
    import okampus from '@/assets/img/logos/okampus.png'

    import logoSrc from '@/assets/img/logos/logo_light.png'
    import logoDarkSrc from '@/assets/img/logos/logo_dark.png'
    // import VueCountdown from '@chenfengyuan/vue-countdown'
    import AppLogin from '@/components/App/AppLogin.vue'
    // import AppLogo from '@/components/App/AppLogo.vue'

    import localStore from '@/store/local.store'

    // import { ref } from 'vue'
    import ClubSwipe from '@/views/List/ClubSwipe.vue'

    import { updateUser } from '@/graphql/queries/users/updateUser'
    import { useMutation } from '@vue/apollo-composable'
    import { showSuccessToast, showToastGraphQLError } from '@/utils/toast'

    import { Swiper, SwiperSlide } from 'swiper/vue'
    import { Navigation, Pagination } from 'swiper'

    import { ref } from 'vue'
    import SwiperButton from '@/components/App/Swiper/SwiperButton.vue'

    const modules = [Pagination, Navigation]
    const { mutate: updateUserMutation, onDone: onDoneUser, onError: onErrorUser } = useMutation(updateUser)

    onDoneUser(({ data }) => {
        localStore.value.me = data.updateUser
        showSuccessToast('Bienvenue sur le swipe des associations 🥂')
    })
    onErrorUser(showToastGraphQLError)

    const swiper = ref(null)
    // import { showSuccessToast } from '@/utils/toast'

    // const counting = ref(true)

    // const agreeToTerms = () => {
    //     if (!counting.value) {
    //         localStore.value.agreedToTerms = true
    //         showSuccessToast("Bienvenue sur la bêta d'Okampus 🎉 !")
    //     }
    // }
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
