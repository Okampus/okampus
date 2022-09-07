<template>
    <GraphQLQuery
        :query="getClubs"
        :update="
            (data) => {
                if (isNil(clubs)) {
                    clubs = data?.clubs
                        .map((club) => ({ value: { ...club, done: false }, sort: Math.random() }))
                        .sort((a, b) => a.sort - b.sort)
                        .map(({ value }, i) => ({ ...value, idx: i }))

                    cardRefs = Array(clubs.length)
                    currentIdx = clubs.length - 1
                }
                return data?.clubs
            }
        "
        :whole-page="true"
        class="overflow-hidden px-5"
        empty-subtitle="Aucune association n'a encore été créée."
    >
        <template v-if="shownCards.length && (!localStore.me?.finishedOnboarding || showSwipe)">
            <SwipeableCard
                v-for="club of shownCards"
                :ref="(el) => (cardRefs[club.idx] = el)"
                :key="club"
                class="absolute inset-0 m-auto h-[95%] max-w-full md:max-w-[50rem]"
                :can-swipe="canSwipe"
                @swipe="(direction) => onSwipe(direction, club)"
            >
                <ClubCardSwipe
                    :club="club"
                    class="h-full"
                    :clickable="false"
                    @show-profile="
                        () => {
                            showButtons = false
                            canSwipe = false
                        }
                    "
                    @close-profile="
                        () => {
                            showButtons = true
                            canSwipe = true
                        }
                    "
                />
            </SwipeableCard>
            <template v-if="showButtons">
                <div
                    class="absolute inset-x-0 bottom-10 mx-auto flex w-fit cursor-pointer select-none transition-transform hover:scale-110 md:gap-20 md-max:inset-x-20 md-max:justify-between"
                    @click="
                        () => {
                            cardRefs[currentIdx].onThresholdReached('swipe-top')
                            swipeTimeout()
                        }
                    "
                >
                    <div class="flex flex-col items-center gap-1 text-blue-200">
                        <div
                            class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-500 xs-max:h-14 xs-max:w-14"
                        >
                            <i class="fa fa-comment-dots text-3xl text-blue-500" />
                            <!-- <div class="text-3xl text-blue-500">👋</div> -->
                        </div>
                        <div class="text-xs font-medium md-max:text-[0.6rem]">Contacter</div>
                    </div>
                </div>
                <div
                    class="absolute bottom-10 z-10 w-fit cursor-pointer select-none transition-transform hover:scale-110 md:inset-x-0 md:mx-auto md:translate-x-[-20rem] md-max:left-6"
                    @click="
                        () => {
                            if (currentIdx < clubs.length - 1) {
                                clubs[currentIdx + 1].done = false
                                currentIdx++
                            }
                        }
                    "
                >
                    <div class="flex flex-col items-center gap-1 text-yellow-200">
                        <div
                            class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-yellow-500 xs-max:h-14 xs-max:w-14"
                        >
                            <i class="fa fa-rotate-left text-4xl text-yellow-500 xs-max:text-3xl" />
                        </div>
                        <div class="text-xs font-medium md-max:text-[0.6rem]">Retour arrière</div>
                    </div>
                </div>
                <div
                    class="absolute bottom-10 z-10 w-fit cursor-pointer select-none transition-transform hover:scale-110 md:inset-x-0 md:mx-auto md:translate-x-[-10rem] md-max:left-[23%]"
                    @click="
                        () => {
                            cardRefs[currentIdx].onThresholdReached('swipe-left')
                            swipeTimeout()
                        }
                    "
                >
                    <div class="flex flex-col items-center gap-1 text-red-200">
                        <div
                            class="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-2 border-red-500 xs-max:h-[4rem] xs-max:w-[4rem]"
                        >
                            <i class="fa fa-xmark text-5xl text-red-500 xs-max:text-4xl" />
                        </div>
                        <div class="text-xs font-medium md-max:text-[0.6rem]">Pas intéressé(e)</div>
                    </div>
                </div>
                <div
                    class="absolute bottom-10 z-10 w-fit cursor-pointer select-none transition-transform hover:scale-110 md:inset-x-0 md:mx-auto md:translate-x-[10rem] md-max:right-[23%]"
                    @click="
                        () => {
                            cardRefs[currentIdx].onThresholdReached('swipe-right')
                            swipeTimeout()
                        }
                    "
                >
                    <div class="flex flex-col items-center gap-1 text-green-200">
                        <div
                            class="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-2 border-green-500 xs-max:h-[4rem] xs-max:w-[4rem]"
                        >
                            <i class="fa fa-check text-5xl text-green-500 xs-max:text-4xl" />
                        </div>
                        <div class="text-xs font-medium md-max:text-[0.6rem]">Intéressé(e)</div>
                    </div>
                </div>
                <div
                    class="absolute bottom-10 z-10 w-fit cursor-pointer select-none transition-transform md:inset-x-0 md:mx-auto md:translate-x-[20rem] md-max:right-6"
                    :class="{
                        'hover:scale-110': clubs[currentIdx].socials.some(
                            (social) => social.socialType === 'Discord',
                        ),
                    }"
                    @click="openCurrentDiscord"
                >
                    <div
                        class="flex flex-col items-center gap-1"
                        :class="
                            clubs[currentIdx].socials.some((social) => social.socialType === 'Discord')
                                ? 'text-violet-200'
                                : 'text-gray-200'
                        "
                    >
                        <div
                            class="flex h-16 w-16 items-center justify-center rounded-full border-2 xs-max:h-14 xs-max:w-14"
                            :class="
                                clubs[currentIdx].socials.some((social) => social.socialType === 'Discord')
                                    ? 'border-violet-500'
                                    : 'border-gray-500'
                            "
                        >
                            <i
                                class="fab fa-discord text-4xl xs-max:text-3xl"
                                :class="
                                    clubs[currentIdx].socials.some(
                                        (social) => social.socialType === 'Discord',
                                    )
                                        ? 'text-violet-500'
                                        : 'text-gray-500'
                                "
                            />
                        </div>
                        <div class="text-xs font-medium md-max:text-[0.6rem]">Discord</div>
                    </div>
                </div>
            </template>
        </template>
        <div v-else class="text-1 relative mt-20 flex w-full flex-col items-center">
            <img :src="Trophy" class="z-10 h-64 w-64" />
            <ConfettiExplosion class="!z-0" :duration="8000" :particle-count="150" :force="1" />
            <div class="z-10 flex w-full flex-col items-center gap-10">
                <div class="flex flex-col items-center gap-4">
                    <div class="text-0 text-4xl font-semibold">Félicitations 🎉</div>
                    <div class="text-2 text-center text-xl">Vous avez fini le swipe des associations !</div>
                </div>
                <div class="flex flex-col items-center gap-2 rounded-lg bg-yellow-200 p-4 dark:bg-yellow-800">
                    <div class="text-2 text-xs uppercase">points attribués</div>
                    <div class="text-4xl font-semibold">🪙 10</div>
                </div>
                <div class="flex flex-col gap-6">
                    <div
                        class="hover-arrow-right cursor-pointer text-2xl text-blue-600 dark:text-blue-400 md-max:text-xl"
                        @click="showSwipe = true"
                    >
                        Refaire le swipe des associations<i class="fa fa-arrow-right ml-2" />
                    </div>
                    <router-link
                        class="hover-arrow-right text-2xl text-blue-600 dark:text-blue-400 md-max:text-xl"
                        to="/clubs"
                        >Commencer à utiliser Okampus<i class="fa fa-arrow-right ml-2"
                    /></router-link>
                </div>
            </div>
        </div>
    </GraphQLQuery>
</template>

<script setup>
    import Trophy from '@/assets/img/3dicons/trophy.png'

    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'

    import SwipeableCard from '@/components/App/Card/SwipeableCard.vue'
    import ClubCardSwipe from '@/components/App/ListCard/ClubCardSwipe.vue'
    import ClubMessage from '@/components/Club/ClubMessage.vue'

    import ConfettiExplosion from 'vue-confetti-explosion'

    import { getClubs } from '@/graphql/queries/teams/getClubs'
    import { createInterest } from '@/graphql/queries/teams/createInterest'
    import { updateInterest } from '@/graphql/queries/teams/updateInterest'

    import { emitter } from '@/shared/modules/emitter'

    import { useMutation } from '@vue/apollo-composable'

    import { isNil } from 'lodash'
    import { showInfoToast, showSuccessToast, showToastGraphQLError } from '@/utils/toast'

    import localStore from '@/store/local.store'
    import { LIKE, SUPERLIKE, NOPE } from '@/shared/types/interest-states.enum'

    import { computed, markRaw, ref } from 'vue'

    const showSwipe = ref(false)

    const clubs = ref(null)
    const currentIdx = ref(null)
    const cardRefs = ref(null)
    const shownCards = computed(() => clubs.value.filter((card) => !card.done).slice(-3))

    const {
        mutate: createInterestMutation,
        onError: onErrorCreate,
        onDone: onDoneCreate,
    } = useMutation(createInterest)
    onErrorCreate(showToastGraphQLError)

    const {
        mutate: updateInterestMutation,
        onError: onErrorUpdate,
        onDone: onDoneUpdate,
    } = useMutation(updateInterest)
    onErrorUpdate(showToastGraphQLError)

    onDoneCreate(({ data }) => {
        const name = data.createInterest.team.name
        clubs.value.find((club) => club.name === name).userInterest = data.createInterest
    })

    onDoneUpdate(({ data }) => {
        const newState = data.updateInterest.state
        const name = data.updateInterest.team.name
        if ([LIKE, SUPERLIKE].includes(newState)) {
            showSuccessToast(`Vous êtes maintenant intéressé(e) par ${name} 🙌`)
        } else {
            showSuccessToast(`Vous n'êtes plus intéressé(e) par ${name} 🙅`)
        }

        clubs.value.find((club) => club.name === name).userInterest = data.updateInterest
    })

    const onSwipe = (direction, club) => {
        if (['swipe-left', 'swipe-right'].includes(direction)) {
            cardRefs.value[club.idx].$el.style.animation = 'invisible 500ms'

            setTimeout(() => {
                club.done = true
                currentIdx.value--
            }, 400)

            if (direction === 'swipe-left') {
                if (!club.userInterest) {
                    createInterestMutation({
                        createInterest: { state: NOPE, teamId: club.id, userId: localStore.value.me?.id },
                    })
                } else if (club.userInterest.state !== NOPE) {
                    updateInterestMutation({
                        id: club.userInterest.id,
                        updateInterest: { state: NOPE },
                    })
                }
            } else {
                if (!club.userInterest) {
                    createInterestMutation({
                        createInterest: { state: LIKE, teamId: club.id, userId: localStore.value.me?.id },
                    })
                } else if (![LIKE, SUPERLIKE].includes(club.userInterest.state)) {
                    updateInterestMutation({
                        id: club.userInterest.id,
                        updateInterest: { state: LIKE },
                    })
                }
            }
        } else {
            if (direction === 'swipe-top') {
                emitter.emit('show-bottom-sheet', {
                    title: `Hello ${club.name} 👋`,
                    component: markRaw(ClubMessage),
                    padded: true,
                    props: {
                        club,
                        successCallback: (userInterest) => {
                            club.userInterest = userInterest
                            cardRefs.value[club.idx].$el.style.animation = 'invisible 500ms'

                            setTimeout(() => {
                                club.done = true
                                currentIdx.value--
                            }, 400)
                        },
                    },
                    showUnsaved: false,
                })
            }
            cardRefs.value[club.idx].reset()
        }
    }

    const currentHasDiscord = computed(() =>
        clubs.value[currentIdx.value].socials.some((social) => social.socialType === 'Discord'),
    )
    const openCurrentDiscord = computed(() =>
        currentHasDiscord.value
            ? () =>
                  window.open(
                      clubs.value[currentIdx.value].socials.find((social) => social.socialType === 'Discord')
                          .link,
                  )
            : () =>
                  showInfoToast(`${clubs.value[currentIdx.value].name} n'a pas de Discord public !`, {
                      position: 'top',
                  }),
    )

    const canSwipe = ref(true)
    const swipeTimeout = () => {
        if (canSwipe.value) setTimeout(() => (canSwipe.value = true), 500)
        canSwipe.value = false
    }

    const showButtons = ref(true)

    defineProps({})
</script>

<style>
    @keyframes invisible {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }
</style>
